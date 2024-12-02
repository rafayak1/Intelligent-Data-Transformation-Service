import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        navigate('/login');              // Redirect to login page
    };

    return (
        <AppBar position="sticky" sx={{ mb: 4, bgcolor: '#d32f2f', boxShadow: 2 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
                    MyApp
                </Typography>
                <Button color="inherit" onClick={() => navigate('/home')} sx={{ textTransform: 'none' }}>
                    Home
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;