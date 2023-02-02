import React, { useState } from 'react';


export default function App(){
    const [image,setImage]=useState(null)
    const  handleSubmit=e=>{
        e.preventDefault()

        fetch('/api/reconstract',{method:'GET'})
        .then(res=>res.json())
        .then(data=>{
            let bytestring = data.status
            let ima = bytestring.split('\'')[1]
            setImage(ima)
        })
    }

    const handleChange=e=>{
        e.preventDefault()
        const data=new FormData();
        data.append('file',e.target.files[0])
        fetch('/api/upload/multiple',{method:"POST",body:data})
        .then(res=>res.json())
        .then(data=>alert(data.message))
    }

    console.log( image)
    return(
        <div>
            <form encType='multipart/form-data'>
                <input type='file' name="upload" onChange={handleChange} />

            </form>
            <button onClick={handleSubmit}>Reconstract</button>
            {image&&<img src={'data:image/jpeg;base64,'+image} />}
        </div>
    )
}


