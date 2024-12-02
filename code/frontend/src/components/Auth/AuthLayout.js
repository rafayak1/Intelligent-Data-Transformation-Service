// src/components/Auth/AuthLayout.js
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left Side (Image or Branding) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: 'url("https://source.unsplash.com/random")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Side (Content) */}
      <Grid
        item
        xs={12}
        md={6}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Your App
          </Typography>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;