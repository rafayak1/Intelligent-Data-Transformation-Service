import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('csv'); // Default file type is CSV

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType); // Send file type as part of the request

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
      }}
    >
      <Typography variant="h4" mb={3}>
        Upload Your Dataset
      </Typography>
      <FormControl sx={{ marginBottom: 3, minWidth: 150, backgroundColor: '#1e1e1e', borderRadius: 1 }}>
        <InputLabel sx={{ color: '#fff' }}>File Type</InputLabel>
        <Select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          sx={{
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
            },
          }}
        >
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="tsv">TSV</MenuItem>
        </Select>
      </FormControl>
      <TextField
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        sx={{
          marginBottom: 3,
          input: { color: '#fff' },
        }}
      />
      <Button
        variant="contained"
        onClick={handleUpload}
        sx={{ textTransform: 'none', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;


// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import axios from '../utils/axiosConfig';
// import { toast } from 'react-toastify';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [fileType, setFileType] = useState('csv'); // Default file type is CSV

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file to upload');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('file_type', fileType); // Send file type as part of the request

//     try {
//       const response = await axios.post('/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });
//       toast.success(response.data.message);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Upload failed');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         background: (theme) => `linear-gradient(to right, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
//         color: '#fff',
//         padding: 4,
//       }}
//     >
//       <Typography variant="h4" mb={3} sx={{ color: 'primary.main', fontWeight: '600' }}>
//         Upload Your Dataset
//       </Typography>
//       <FormControl sx={{ marginBottom: 3, minWidth: 150, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
//         <InputLabel sx={{ color: 'text.primary' }}>File Type</InputLabel>
//         <Select
//           value={fileType}
//           onChange={(e) => setFileType(e.target.value)}
//           sx={{
//             color: 'text.primary',
//             '& .MuiOutlinedInput-notchedOutline': {
//               borderColor: 'primary.main',
//             },
//             '&:hover .MuiOutlinedInput-notchedOutline': {
//               borderColor: 'primary.dark',
//             },
//             '& .MuiSelect-icon': {
//               color: 'primary.main',
//             },
//           }}
//         >
//           <MenuItem value="csv">CSV</MenuItem>
//           <MenuItem value="tsv">TSV</MenuItem>
//         </Select>
//       </FormControl>
//       <TextField
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//         variant="outlined"
//         sx={{
//           marginBottom: 3,
//           width: '100%',
//           input: { color: '#fff' },
//           borderRadius: 2,
//           backgroundColor: 'background.paper',
//           boxShadow: 1,
//           '&:hover': {
//             boxShadow: 3,
//           },
//         }}
//       />
//       <Button
//         variant="contained"
//         onClick={handleUpload}
//         sx={{
//           textTransform: 'none',
//           backgroundColor: 'primary.main',
//           borderRadius: 2,
//           boxShadow: 3,
//           '&:hover': {
//             backgroundColor: 'primary.dark',
//             boxShadow: 5,
//           },
//         }}
//       >
//         Upload
//       </Button>
//     </Box>
//   );
// };

// export default FileUpload;
