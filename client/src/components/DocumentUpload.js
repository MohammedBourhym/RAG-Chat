import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadDocument } from '../services/api';

const DocumentUpload = ({ onDocumentUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    // Only accept PDF files
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await uploadDocument(file);
      setSuccess('Document uploaded successfully!');
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Documents
      </Typography>
      
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : 'transparent',
          mb: 2
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography>
          {isDragActive
            ? 'Drop the PDF file here'
            : 'Drag and drop a PDF file here, or click to select a file'}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Only PDF files are accepted
        </Typography>
      </Box>

      {uploading && <LinearProgress sx={{ mt: 2, mb: 2 }} />}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default DocumentUpload;
