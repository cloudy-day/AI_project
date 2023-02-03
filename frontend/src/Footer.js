import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Image from 'mui-image'

export const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        width: "100%",
        height: "auto",
        marginLeft:-0.9,
        backgroundColor: "#02B17F",
        // paddingTop: "1rem",
        // paddingBottom: "1rem",
        
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
            <Image src="/images/abstract.png" alt="Certificate icon" width={60} height={60} />
            </Grid>
          <Grid item xs={12}>
            <Typography color="black" variant="h5">
              React Image Reconstruction and Captioning Website
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              {`${new Date().getFullYear()} | React | Material UI | Flask | AI Team 18`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </Box>
  );
};

export default Footer;