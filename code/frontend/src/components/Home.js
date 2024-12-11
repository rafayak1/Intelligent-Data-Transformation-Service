import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    TextField,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import axios from '../utils/axiosConfig';
import Footer from './Footer'; // Import Footer
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for state
import { toast } from 'react-toastify';

const Home = () => {
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('csv'); // Default file type
    const [datasetExists, setDatasetExists] = useState(false); // Check if a dataset already exists
    const [isFirstLogin, setIsFirstLogin] = useState(true); // Track if user is logging in for the first time
    const navigate = useNavigate();
    const location = useLocation(); // Access navigation state

    useEffect(() => {
        const checkDatasetStatus = async () => {
            try {
                const response = await axios.get('/dataset-status', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const { datasetExists } = response.data;

                setDatasetExists(datasetExists);
                setIsFirstLogin(!datasetExists);
            } catch (error) {
                console.error('Error checking dataset status:', error);
                toast.error('Failed to check dataset status.');
            }
        };

        checkDatasetStatus();

        // Automatically set to replace dataset if redirected with state
        if (location.state?.replaceDataset) {
            setIsFirstLogin(true); // Enable "Replace Dataset" mode
        }
    }, [location]);

    const handleLogout = () => {
        toast.info('You have been logged out!');
        navigate('/login');
    };

    const handleFileUpload = async () => {
        if (!file) {
            toast.warning('Please select a dataset to upload.');
            return;
        }

        if (!fileType) {
            toast.warning('Please select the file type.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_type', fileType);

        try {
            const endpoint = isFirstLogin ? '/home' : '/replace-dataset';
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            toast.success(response.data.message || 'Dataset uploaded successfully!');
            navigate('/chat'); // Redirect to chat page after upload
        } catch (error) {
            console.error('Error uploading dataset:', error);
            toast.error(error.response?.data?.message || 'Upload failed.');
        }
    };

    const handleContinueToChat = () => {
        navigate('/chat');
    };

    return (
        <>
            <AppBar position="sticky" sx={{ mb: 4, bgcolor: '#d32f2f', boxShadow: 2 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
                        Intelligent Data Transformation Service
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/home')} sx={{ textTransform: 'none' }}>
                        Home
                    </Button>
                    <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container
                sx={{
                    height: 'calc(100vh - 64px - 40px)', // Subtract navbar and footer height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffebc5',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: 500,
                        textAlign: 'center',
                        backgroundColor: '#fff3e0',
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: '600' }}>
                        {isFirstLogin ? 'Upload Your Dataset' : 'Dataset Already Uploaded'}
                    </Typography>

                    {datasetExists && !isFirstLogin ? (
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mb: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    bgcolor: '#388e3c',
                                    '&:hover': { bgcolor: '#2e7d32' },
                                }}
                                onClick={handleContinueToChat}
                            >
                                Continue to Chat
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    bgcolor: '#d32f2f',
                                    '&:hover': { bgcolor: '#b71c1c' },
                                }}
                                onClick={() => setIsFirstLogin(true)}
                            >
                                Replace Dataset
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Box sx={{ mt: 3, mb: 2 }}>
                                <TextField
                                    type="file"
                                    fullWidth
                                    inputProps={{
                                        onChange: (e) => setFile(e.target.files[0]),
                                    }}
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: 1,
                                        '& input': {
                                            color: '#000',
                                        },
                                    }}
                                />
                            </Box>
                            <FormControl fullWidth sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 1 }}>
                                <InputLabel id="file-type-label" sx={{ color: '#d32f2f' }}>
                                    File Type
                                </InputLabel>
                                <Select
                                    labelId="file-type-label"
                                    value={fileType}
                                    onChange={(e) => setFileType(e.target.value)}
                                    fullWidth
                                    sx={{
                                        color: '#000',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#d32f2f',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#c2185b',
                                        },
                                    }}
                                >
                                    <MenuItem value="csv">CSV</MenuItem>
                                    <MenuItem value="tsv">TSV</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                size="large"
                                onClick={handleFileUpload}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    '&:hover': {
                                        backgroundColor: '#b71c1c',
                                        boxShadow: 5,
                                    },
                                }}
                            >
                                Upload
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

export default Home;