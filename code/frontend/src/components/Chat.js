// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     TextField,
//     Button,
//     Typography,
//     Paper,
//     List,
//     ListItem,
//     CircularProgress,
//     Link,
// } from '@mui/material';
// import axios from '../utils/axiosConfig';
// import { toast } from 'react-toastify';

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     // Add welcome message directly in the frontend
//     useEffect(() => {
//         const welcomeMessage = `
// Welcome to Intelligent Service! Upload your dataset and perform transformations effortlessly.

// Supported Commands:
// ● remove column <column_name>  
//   Example: remove column Age
// ● rename column <old_name> to <new_name>  
//   Example: rename column Age to Years
// ● filter rows where <condition>  
//   Example: filter rows where Age > 25
// ● columns  
//   Example: columns (to list all column names)
// ● size  
//   Example: size (to get the dataset dimensions)
//         `;
//         setMessages([{ sender: 'system', text: welcomeMessage }]);
//     }, []);

//     // Handle sending user input
//     const handleSendMessage = async () => {
//         if (!input.trim()) {
//             toast.error('Please enter a valid command.');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await axios.post(
//                 '/transform',
//                 { command: input },
//                 { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//             );

//             const { message, download_url } = response.data;

//             setMessages((prev) => [
//                 ...prev,
//                 { sender: 'user', text: input },
//                 { sender: 'ai', text: message },
//                 ...(download_url ? [{ sender: 'ai', text: `Download your transformed dataset here:`, downloadUrl: download_url }] : [])
//             ]);
//             setInput(''); // Clear input box after sending the message
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'Failed to apply transformation';
//             setMessages((prev) => [
//                 ...prev,
//                 { sender: 'user', text: input },
//                 { sender: 'ai', text: errorMessage }
//             ]);
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 height: '100vh',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: '#3E2723',
//             }}
//         >
//             <Paper
//                 elevation={6}
//                 sx={{
//                     width: '100%',
//                     maxWidth: 800,
//                     height: '80%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     borderRadius: 2,
//                     backgroundColor: '#D84315',
//                     color: '#fff',
//                 }}
//             >
//                 <Typography
//                     variant="h5"
//                     textAlign="center"
//                     sx={{
//                         padding: 2,
//                         borderBottom: '1px solid #E64A19',
//                         backgroundColor: '#BF360C',
//                     }}
//                 >
//                     Chat with Intelligent Service
//                 </Typography>
//                 <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
//                     <List>
//                         {messages.map((message, index) => (
//                             <ListItem
//                                 key={index}
//                                 sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
//                             >
//                                 <Paper
//                                     elevation={3}
//                                     sx={{
//                                         padding: 1.5,
//                                         maxWidth: '70%',
//                                         borderRadius: '15px',
//                                         backgroundColor: message.sender === 'user' ? '#FF7043' : '#F57C00',
//                                         color: message.sender === 'user' ? '#fff' : '#000',
//                                         whiteSpace: 'pre-wrap', // Preserve line breaks in message text
//                                     }}
//                                 >
//                                     {message.text}
//                                     {message.downloadUrl && (
//                                         <Link
//                                             href={message.downloadUrl}
//                                             target="_blank"
//                                             rel="noopener"
//                                             sx={{
//                                                 display: 'block',
//                                                 marginTop: '10px',
//                                                 color: '#ffcc80',
//                                                 textDecoration: 'none',
//                                                 '&:hover': { color: '#fff' },
//                                             }}
//                                         >
//                                             Download Dataset
//                                         </Link>
//                                     )}
//                                 </Paper>
//                             </ListItem>
//                         ))}
//                     </List>
//                 </Box>
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         padding: 2,
//                         backgroundColor: '#BF360C',
//                         borderTop: '1px solid #E64A19',
//                         alignItems: 'center',
//                     }}
//                 >
//                     <TextField
//                         placeholder="Type a command... (e.g., 'Remove rows where column A > 5')"
//                         fullWidth
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         sx={{
//                             backgroundColor: '#F57C00',
//                             borderRadius: 1,
//                             input: { color: '#fff' },
//                         }}
//                         disabled={isLoading}
//                     />
//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         onClick={handleSendMessage}
//                         disabled={isLoading}
//                         sx={{
//                             marginLeft: 2,
//                             textTransform: 'none',
//                             backgroundColor: '#D84315',
//                             '&:hover': { backgroundColor: '#BF360C' },
//                         }}
//                     >
//                         {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
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

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Add welcome message directly in the frontend
    useEffect(() => {
        const welcomeMessage = `
Welcome to Intelligent Service! Upload your dataset and perform transformations effortlessly.

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
        `;
        setMessages([{ sender: 'system', text: welcomeMessage }]);
    }, []);

    const handleSendMessage = async () => {
        if (!input.trim()) {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: 'Please enter a valid command.' },
            ]);
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await axios.post(
                '/transform',
                { command: input },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
    
            const { message, download_url } = response.data;
    
            setMessages((prev) => [
                ...prev,
                { sender: 'user', text: input },
                { sender: 'ai', text: message },
                ...(download_url ? [{ sender: 'ai', text: `Download your transformed dataset here:`, downloadUrl: download_url }] : [])
            ]);
            setInput(''); // Clear input box after sending the message
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to apply transformation';
    
            // Check if the error message already exists for the current user input
            setMessages((prev) => {
                const userMessages = prev.filter((msg) => msg.sender === 'user' && msg.text === input);
                const errorExists = prev.some((msg) => msg.sender === 'ai' && msg.text === errorMessage);
                if (userMessages.length > 0 && errorExists) {
                    // Prevent duplicate error messages
                    return prev;
                }
                return [
                    ...prev,
                    { sender: 'user', text: input },
                    { sender: 'ai', text: errorMessage },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
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
                                        whiteSpace: 'pre-wrap', // Preserve line breaks in message text
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
    );
};

export default Chat;