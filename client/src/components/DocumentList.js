import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Typography, Divider, Box, Alert } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDocuments, deleteDocument } from '../services/api';

const DocumentList = ({ documents, setDocuments, refreshTrigger, onDocumentDeleted }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]); // Refresh when trigger changes

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    }
  };

  if (loading && documents.length === 0) {
    return <Typography>Loading documents...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (documents.length === 0) {
    return <Typography>No documents uploaded yet</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {documents.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText 
              primary={doc.name}
              secondary={`Uploaded: ${new Date(doc.uploadDate).toLocaleString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDelete(doc.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DocumentList;
