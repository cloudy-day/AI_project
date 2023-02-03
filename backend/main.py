from flask import Flask,request, jsonify
from flask_cors import CORS
from srgan_model import Generator
from dataset import testOnly_data
from torch.utils.data import DataLoader
import numpy as np
from PIL import Image
import torch
import os,io
import json
import base64
from pathlib import Path
from transformers import VisionEncoderDecoderModel, ViTFeatureExtractor, AutoTokenizer




basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

filename =""

cors=CORS(app,resources = {r'/api/*':{'origin':'*' }})
uploads_path = os.path.join(basedir, 'output')



@app.route("/api/reconstract",methods=['POST','GET'])
def predict():
    
    
    # print(filename)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dataset = testOnly_data(LR_path = './input/', in_memory = False, transform = None)
    loader = DataLoader(dataset, batch_size = 1, shuffle = False, num_workers = 0)

    generator = Generator(img_feat = 3, n_feats = 64, kernel_size = 3, num_block = 16)
    generator.load_state_dict(torch.load('SRGAN.pt',map_location=torch.device('cpu')))
    generator = generator.to(device)
    generator.eval()
    imgUrl=''
    result=None

    with torch.no_grad():
        for i, te_data in enumerate(loader):
            lr = te_data['LR'].to(device)
            output, _ = generator(lr)
            output = output[0].cpu().numpy()
            output = (output + 1.0) / 2.0
            output = output.transpose(1,2,0)
            result = Image.fromarray((output * 255.0).astype(np.uint8))
            imgUrl='./output/a_%04d.png'%i
            result.save(imgUrl)
    
    rawBytes = io.BytesIO()
    result.save(rawBytes, "JPEG")
    rawBytes.seek(0)
    img_base64 = base64.b64encode(rawBytes.read())
            
    return jsonify({'status':str(img_base64),'filename':imgUrl})




@app.route("/api/upload/multiple",methods=['POST'])
def upload():
    if request.method == 'POST':
        [f.unlink() for f in Path(basedir+"/input").glob("*") if f.is_file()] 
        [f.unlink() for f in Path(basedir+"/output").glob("*") if f.is_file()] 
        file=request.files['file']
        filename = file.filename
        print(filename)
        file.save(os.path.join( 'input/', filename))
        return jsonify({'message':"Successfully saved"})
        




model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTFeatureExtractor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)



max_length = 16
num_beams = 4
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}


def predict_step(image_paths):
    images = []
    for image_path in image_paths:
        i_image = Image.open(image_path)
        if i_image.mode != "RGB":
            i_image = i_image.convert(mode="RGB")

        images.append(i_image)

    pixel_values = feature_extractor(images=images, return_tensors="pt").pixel_values
    pixel_values = pixel_values.to(device)

    output_ids = model.generate(pixel_values, **gen_kwargs)

    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]
    return preds


@app.route("/api/labeling",methods=['GET','POST'])
def label():
  
    return jsonify({'status':predict_step(['./output/a_0000.png'])})

   
   



if  __name__=="__main__":
    app.run(debug=True)