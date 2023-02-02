import React, { useState } from 'react';
import Box from '@mui/material/Box';
import DenseAppBar from './AppBar';
import { Button } from '@mui/material';
import { borderRadius, styled } from '@mui/system';
import Image from 'mui-image'
// 👇 Custom Styles for the Box Component
const CustomBox = styled('box')({
    '&.MuiBox-root': {
      backgroundColor: '#fff',
      borderRadius: '2rem',
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      padding: '1rem',
    },
    '&.MuiBox-root:hover, &.MuiBox-root.dragover': {
      opacity: 0.6,
    },
  });
  

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
            <DenseAppBar/>
        <div>
        <CustomBox>   
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            //position: 'relative',
            width: '60%',
            height: '5rem',
            border: '2px dashed #ffbf00',
            borderRadius: '20px',
            marginTop:'20px',
            mx:'auto'
          }}
        >
            <form encType='multipart/form-data' >
                {/* <input type='file' name="upload" onChange={handleChange}  /> */}
                <Button
                    variant="contained"
                    component="label"
                    fullwidth  
                    sx={{ py: '0.8rem', my: 2,bgcolor: '#02B17F'  }} 
                    marginRight = "10"
                    >
                    Upload File
                    <input
                        type="file"
                        name="upload"
                        hidden
                        onChange={handleChange} 
                    />
                    </Button>
                   
            </form>
            
            <Button variant='contained' fullwidth  sx={{ py: '0.8rem', my: 2,bgcolor: '#02B17F' ,marginLeft:'100px'  }}  onClick={handleSubmit}>Reconstruct</Button>
           
            {/* {image&&<img src={'data:image/jpeg;base64,'+image} />} */}
         </Box>
         <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            //position: 'relative',
            width: '90%',
            height: '25rem',
            border: '2px dashed #bf00ff',
            borderRadius: '20px',
            marginTop:'5px',
            mx:'auto'
          }}>
           {image&&<img src={'data:image/jpeg;base64,'+image} />} 
           {/* <Image src="/images/photo.png" alt="Certificate icon" width={150} height={140} sx={{ marginLeft:20}} /> */}
          </Box>
         </CustomBox> 
        </div>
        </div>
    )
}


