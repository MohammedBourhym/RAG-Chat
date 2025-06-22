import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Divider, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendChatMessage(inputValue);
      
      const botMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: Date.now(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%'
    }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <SmartToyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="body1">
              Upload documents and start asking questions!
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex',
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <Avatar sx={{ 
                mr: 1, 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main'
              }}>
                {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                maxWidth: '80%'
              }}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={3}
        />
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          sx={{ ml: 1, height: 56 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
