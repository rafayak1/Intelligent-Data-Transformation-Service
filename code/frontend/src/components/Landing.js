// // src/components/Landing.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Button, Typography, Container } from '@mui/material';

// const Landing = () => {
//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         textAlign: 'center',
//         backgroundImage: 'url("https://source.unsplash.com/random/1600x900")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         color: '#fff',
//       }}
//     >
//       <Typography variant="h2" gutterBottom>
//         Welcome to Your App
//       </Typography>
//       <Typography variant="h5" gutterBottom>
//         Seamlessly transform your data with AI.
//       </Typography>
//       <Box sx={{ mt: 4 }}>
//         <Button
//           component={Link}
//           to="/login"
//           variant="contained"
//           color="primary"
//           sx={{ mr: 2 }}
//         >
//           Login
//         </Button>
//         <Button
//           component={Link}
//           to="/signup"
//           variant="outlined"
//           color="secondary"
//         >
//           Sign Up
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Landing;


import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container, Grid } from '@mui/material';

const Landing = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url("https://source.unsplash.com/random/1600x900")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff',
        padding: 3,
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 87, 34, 0.7)', // Warm orange overlay
        }}
      />

      {/* Content box */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
            mb: 2,
            color: '#FF5722', // Warm red-orange
          }}
        >
          Welcome to Your App
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            mb: 4,
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
            color: '#FFC107', // Warm yellow
          }}
        >
          Seamlessly transform your data with AI.
        </Typography>

        <Box>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              fontSize: '1rem',
              padding: '12px 24px',
              backgroundColor: '#D32F2F', // Red background
              color: '#fff',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                backgroundColor: '#B71C1C', // Darker red on hover
              },
              mr: 2,
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            sx={{
              fontSize: '1rem',
              padding: '12px 24px',
              borderColor: '#FF9800', // Orange border
              color: '#333333', // Orange text
              borderWidth: 2,
              '&:hover': {
                borderColor: '#F57C00', // Darker orange on hover
                color: '#F57C00', // Darker orange text
                backgroundColor: 'rgba(255, 152, 0, 0.1)', // Light orange background
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Landing;





