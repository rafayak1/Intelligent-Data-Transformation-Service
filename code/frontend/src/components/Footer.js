import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#3E2723',
                color: '#FFFFFF',
                textAlign: 'center',
                padding: 2,
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #BF360C',
            }}
        >
            <Typography variant="body2">
                Created by Rafay and Minal for Datacentre Scale Computing Fall 2024
            </Typography>
        </Box>
    );
};

export default Footer;