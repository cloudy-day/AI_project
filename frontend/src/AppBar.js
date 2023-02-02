import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Logo from './Logo';

export default function DenseAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#02B17F' ,marginTop:-1, width:'120%',marginLeft:-1 }}>
        <Logo/>
        {/* <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            ReconLab
          </Typography>
        </Toolbar> */}
      </AppBar>
    </Box>
  );
}