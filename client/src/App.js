import React, { useState } from 'react';
import { Box, CssBaseline, Container, Grid, Paper } from '@mui/material';
import Header from './components/Header';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';
import DocumentList from './components/DocumentList';

function App() {
  const [documents, setDocuments] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDocumentUploaded = () => {
    // Trigger a refresh of the document list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Document Upload */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            </Paper>
          </Grid>
          
          {/* Document List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '500px', overflow: 'auto' }}>
              <DocumentList 
                documents={documents}
                setDocuments={setDocuments}
                refreshTrigger={refreshTrigger}
                onDocumentDeleted={handleDocumentUploaded}
              />
            </Paper>
          </Grid>
          
          {/* Chat Interface */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
              <ChatInterface />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
