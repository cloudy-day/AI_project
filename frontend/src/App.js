import React, { useState } from 'react';
import Box from '@mui/material/Box';
import DenseAppBar from './AppBar';
import { Button } from '@mui/material';
import {  styled } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import StickyFooter from './Footer';
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
    const [img,setImg]=useState(null)
    const [label,setLabel]=useState(null)
    const  handleSubmit=e=>{
        e.preventDefault()

        fetch('/api/reconstract',{method:'GET'})
        .then(res=>res.json())
        .then(data=>{
            let bytestring = data.status
            console.log(data.filename)
            let ima = bytestring.split('\'')[1]
            setImage(ima)

            fetch(`api/labeling`,{method:'GET'})
            .then(res=>res.json())
            .then(data=>{console.log(data.status);setLabel(data.status[0])})
        })

        
    }

    const handleChange=e=>{
        e.preventDefault()
        const data=new FormData();
        setImg(URL.createObjectURL(e.target.files[0]))
        data.append('file',e.target.files[0])
        fetch('/api/upload/multiple',{method:"POST",body:data})
        .then(res=>res.json())
        .then(data=>alert(data.message))
    }

    const refresh = () => window.location.reload(true)

    // console.log( image)
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
            <Button variant='contained' fullwidth  sx={{ py: '0.8rem', my: 2,bgcolor: '#02B17F' ,marginLeft:'100px'  }}  onClick={refresh}>Refresh</Button>
            {/* {image&&<img src={'data:image/jpeg;base64,'+image} />} */}
         </Box>
         <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            //position: 'relative',
            width: '90%',
            height: 'auto',
            border: '2px dashed #bf00ff',
            borderRadius: '20px',
            marginTop:'5px',
            mx:'auto'
          }}>
          <Grid container spacing={20} marginTop={0.001} marginBottom={0.001}>
            <Grid>
           <Card >  
           <Box
           display='flex'
           justifyContent='center'
           alignItems='center'
           sx={{mx:'auto'}}
           >
           <Typography variant="h6" component="div" padding={1}>
         After
        </Typography>
         </Box>   
          {image&&<img src={'data:image/jpeg;base64,'+image}  />} 
          </Card>
          </Grid>
          <Grid>
          <Card >
          <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{mx:'auto'}}
          >
          <Typography variant="h6" component="div" padding={1}>
         Before
        </Typography>  
        </Box>
           {img && <img src={img} width={250} height={200}/>}
           </Card>
           </Grid>
          </Grid> 
          </Box>
          <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            //position: 'relative',
            width: '90%',
            minHeight:'3rem',
            maxHeight: 'auto',
            borderRadius: '20px',
            marginTop:'35px',
            mx:'auto'
          }}>
          <Typography variant='h5' component="div" color='black'>
              Decription<br/>
            </Typography>
            </Box>
          <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{
            //position: 'relative',
            width: '90%',
            minHeight:'5rem',
            maxHeight: 'auto',
            border: '2px dashed #f774af',
            borderRadius: '20px',
            marginTop:'2px',
            mx:'auto'
          }}>
          <Typography variant="h5" component="div">
          {label}
         </Typography> 
          </Box>
         </CustomBox> 
        </div>
        <StickyFooter/>
        </div>
    )
}


