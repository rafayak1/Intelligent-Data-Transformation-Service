import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('/signup', { name, email, password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: (theme) =>
          `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.warning.main})`,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 5,
          borderRadius: 4,
          width: '100%',
          maxWidth: 450,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: 'error.main', fontWeight: '600' }}>
          Join Our Community
        </Typography>
        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: 'error.main', fontWeight: '400' }}>
          Sign Up
        </Typography>
        <Typography variant="body1" textAlign="center" gutterBottom sx={{ color: 'text.secondary' }}>
          Create an account to get started
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '&:hover .MuiOutlinedInput-root': {
                borderColor: 'error.main',
              },
            }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '&:hover .MuiOutlinedInput-root': {
                borderColor: 'error.main',
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '&:hover .MuiOutlinedInput-root': {
                borderColor: 'error.main',
              },
            }}
          />
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            onClick={handleSignup}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'error.dark',
                boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
