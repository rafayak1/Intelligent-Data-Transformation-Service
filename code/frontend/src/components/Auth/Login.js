// // src/components/Auth/Login.js
// import React, { useState } from 'react';
// import { Box, Button, TextField, Typography, Container, Link, Paper } from '@mui/material';
// import axios from '../../utils/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('/login', { email, password });
//       const token = response.data.token;
//       localStorage.setItem('token', token); // Store the JWT
//       toast.success('Login successful!');
//       navigate('/home');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <Container
//       maxWidth="xs"
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundImage: 'url("https://source.unsplash.com/random/1600x900?nature")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           padding: 4,
//           borderRadius: 2,
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           width: '100%',
//           maxWidth: 400,
//         }}
//       >
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Login
//         </Typography>
//         <Typography variant="body1" textAlign="center" gutterBottom>
//           Access your account
//         </Typography>
//         <Box
//           component="form"
//           sx={{
//             mt: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 2,
//           }}
//         >
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             label="Password"
//             type="password"
//             fullWidth
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             size="large"
//             onClick={handleLogin}
//             sx={{ textTransform: 'none', fontWeight: 'bold' }}
//           >
//             Login
//           </Button>
//         </Box>
//         <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
//           Don’t have an account?{' '}
//           <Link href="/signup" underline="hover">
//             Sign up
//           </Link>
//         </Typography>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;

// src/components/Auth/Login.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Link, Paper } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token); // Store the JWT
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(to right, #f7b733, #fc6071)`, // Gradient background with warm shades of orange and red
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 5,
          borderRadius: 4,
          backgroundColor: '#fff3e0', // Light orange shade for the Paper
          width: '100%',
          maxWidth: 450,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
          margin: 'auto', // Center the Paper in the Container
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#d32f2f', fontWeight: '600' }}>
          Welcome to Your App
        </Typography>
        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: '#d32f2f', fontWeight: '400' }}>
          Login
        </Typography>
        <Typography variant="body1" textAlign="center" gutterBottom sx={{ color: '#d84315' }}>
          Access your account
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                borderColor: '#d84315', // Dark orange border
              },
              '&:hover .MuiOutlinedInput-root': {
                borderColor: '#c2185b', // Darker red border on hover
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                borderColor: '#d84315', // Dark orange border
              },
              '&:hover .MuiOutlinedInput-root': {
                borderColor: '#c2185b', // Darker red border on hover
              },
            }}
          />
          <Button
            variant="contained"
            color="error" // Red for a warm, inviting button color
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              backgroundColor: '#d84315', // Warm red shade
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#b71c1c', // Darker red for hover
                boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: '#d84315' }}>
          Don’t have an account?{' '}
          <Link href="/signup" underline="hover" sx={{ color: '#c2185b', fontWeight: 'bold' }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
