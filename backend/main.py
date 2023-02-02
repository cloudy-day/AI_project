from flask import Flask,send_file,request, jsonify, make_response,flash,send_from_directory
from flask_cors import cross_origin,CORS
from srgan_model import Generator
from dataset import testOnly_data
from torch.utils.data import DataLoader
import numpy as np
from PIL import Image
import torch
import os,io
import json
import base64
# model = torch.load('SRGAN.pt',map_location=torch.device('cpu'))
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
filename ="input/1.png"

cors=CORS(app,resources = {r'/api/*':{'origin':'*' }})
uploads_path = os.path.join(basedir, 'output')

# @app.route("/",methods=['GET'])
# def member():
#     image = cv2.imread(filename)
#     cv2.imwrite('output/abc.png',image)
#     return "successfull"

@app.route("/api/reconstract",methods=['POST','GET'])
def predict():
    

    
    # if request.method == "OPTIONS": # CORS preflight
    #     return _build_cors_preflight_response()
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
            
    return jsonify({'status':str(img_base64)})

@app.route("/api/upload/multiple",methods=['POST'])
def upload():
    if request.method == 'POST':
        file=request.files['file']
        filename = file.filename
        print(filename)
        file.save(os.path.join( 'input/', filename))
        return jsonify({'message':"Successfully saved"})
        
    


if  __name__=="__main__":
    app.run(debug=True)