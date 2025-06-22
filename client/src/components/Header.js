import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <SmartToyIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EduN7 RAG Chatbot
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
