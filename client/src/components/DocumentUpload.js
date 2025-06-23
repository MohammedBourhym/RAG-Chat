import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
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
    <div>
      <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
        Upload Documents
      </h2>
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed border-gray-300 dark:border-secondary-600 
          rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'bg-primary-50 dark:bg-secondary-700/50' : 'hover:bg-gray-50 dark:hover:bg-secondary-700/30'} 
          mb-4
        `}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-primary-500 mb-3" />
        <p className="text-secondary-700 dark:text-gray-300 mb-1">
          {isDragActive
            ? 'Drop the PDF file here'
            : 'Drag and drop a PDF file here, or click to select a file'}
        </p>
        <p className="text-xs text-secondary-500 dark:text-gray-400">
          Only PDF files are accepted
        </p>
      </div>

      {uploading && (
        <div className="w-full h-2 bg-gray-200 dark:bg-secondary-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary-500 animate-pulse rounded-full"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-4 rounded">
          <p className="text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
