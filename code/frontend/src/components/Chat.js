import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    CircularProgress,
    Link,
} from '@mui/material';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [useUpdatedDataset, setUseUpdatedDataset] = useState(false);
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const navigate = useNavigate(); // To navigate between pages

    // Add welcome message directly in the frontend
    useEffect(() => {
        const welcomeMessage = `
Welcome to Intelligent Data Transformation Service! Send me commands to perform transformations effortlessly.

Supported Commands:
● remove column <column_name>  
  Example: remove column Age
● rename column <old_name> to <new_name>  
  Example: rename column Age to Years
● filter rows where <condition>  
  Example: filter rows where Age > 25
● columns  
  Example: columns (to list all column names)
● size  
  Example: size (to get the dataset dimensions)
● change dataset  
  Example: change dataset (to upload or replace your dataset)
        `;
        setMessages([{ sender: 'system', text: welcomeMessage }]);
    }, []);

    // Scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending user input
    const handleSendMessage = async () => {
        if (!input.trim()) {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: 'Please enter a valid command.' },
            ]);
            setInput('');
            return;
        }

        if (input.toLowerCase() === 'change dataset') {
            handleChangeDataset();
            return;
        }

        if (awaitingResponse) {
            handleUserChoice(input.trim().toLowerCase());
            setInput('');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                '/transform',
                { command: input, useUpdatedDataset },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const { message, download_url, prompt } = response.data;

            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: input },
                { sender: 'ai', text: message },
                ...(download_url ? [{ sender: 'ai', text: `Download your transformed dataset here:`, downloadUrl: download_url }] : []),
                ...(prompt ? [{ sender: 'system', text: prompt }] : []),
            ]);

            if (prompt) {
                setAwaitingResponse(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to apply transformation';

            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: input },
                { sender: 'ai', text: errorMessage },
            ]);
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    // Handle user's response to the prompt
    const handleUserChoice = (choice) => {
        if (choice === 'yes') {
            setUseUpdatedDataset(true);
            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: 'yes' },
                { sender: 'system', text: 'Using updated dataset for further transformations.' },
            ]);
        } else if (choice === 'no') {
            setUseUpdatedDataset(false);
            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: 'no' },
                { sender: 'system', text: 'Using original dataset for further transformations.' },
            ]);
        } else {
            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: choice },
                { sender: 'ai', text: 'Please respond with "yes" or "no".' },
            ]);
            return;
        }
        setAwaitingResponse(false);
    };

    // Handle "change dataset" command
    const handleChangeDataset = () => {
        setMessages((prev) => [
            ...prev,
            { sender: 'user', text: 'change dataset' },
            { sender: 'system', text: 'Redirecting to dataset upload page...' },
        ]);

        setTimeout(() => {
            navigate('/home', { state: { replaceDataset: true } }); // Pass state to Home.js
        }, 1000);
    };

    return (
        <>
            <Navbar />

            <Box
                sx={{
                    height: 'calc(100vh - 64px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#3E2723',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        height: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        backgroundColor: '#D84315',
                        color: '#fff',
                    }}
                >
                    <Typography
                        variant="h5"
                        textAlign="center"
                        sx={{
                            padding: 2,
                            borderBottom: '1px solid #E64A19',
                            backgroundColor: '#BF360C',
                        }}
                    >
                        Chat with Intelligent Service
                    </Typography>
                    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem
                                    key={index}
                                    sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: 1.5,
                                            maxWidth: '70%',
                                            borderRadius: '15px',
                                            backgroundColor: message.sender === 'user' ? '#FF7043' : '#F57C00',
                                            color: message.sender === 'user' ? '#fff' : '#000',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {message.text}
                                        {message.downloadUrl && (
                                            <Link
                                                href={message.downloadUrl}
                                                target="_blank"
                                                rel="noopener"
                                                sx={{
                                                    display: 'block',
                                                    marginTop: '10px',
                                                    color: '#ffcc80',
                                                    textDecoration: 'none',
                                                    '&:hover': { color: '#fff' },
                                                }}
                                            >
                                                Download Dataset
                                            </Link>
                                        )}
                                    </Paper>
                                </ListItem>
                            ))}
                            <div ref={chatEndRef} />
                        </List>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            padding: 2,
                            backgroundColor: '#BF360C',
                            borderTop: '1px solid #E64A19',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            placeholder="Type a command... (e.g., 'Remove rows where column A > 5')"
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            sx={{
                                backgroundColor: '#F57C00',
                                borderRadius: 1,
                                input: { color: '#fff' },
                            }}
                            disabled={isLoading}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            sx={{
                                marginLeft: 2,
                                textTransform: 'none',
                                backgroundColor: '#D84315',
                                '&:hover': { backgroundColor: '#BF360C' },
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Chat;