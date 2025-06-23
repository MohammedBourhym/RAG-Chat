import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  ClipboardDocumentIcon,
  LinkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Sample suggested questions
  const suggestedQuestions = [
    "What are the key concepts in artificial intelligence?",
    "Explain the RAG architecture in simple terms",
    "How does a vector database help with document retrieval?",
    "Compare different LLM models and their capabilities"
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const behavior = messages.length <= 1 ? 'auto' : 'smooth';
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input on first render
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Typing animation effect
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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

    // Show typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, 500);

    try {
      const response = await sendChatMessage(inputValue);
      
      // Hide typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      const botMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
        sources: response.sources || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Hide typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: Date.now(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
    // Optional: Auto-send the question
    // setTimeout(() => handleSendMessage(), 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto mb-4 pr-2 scrollbar-thin"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-primary-500/50 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              Start a Conversation
            </h3>
            <p className="text-secondary-600 dark:text-gray-400 max-w-md mb-8">
              Ask questions about your uploaded documents to get accurate, relevant answers.
            </p>
            
            {/* Suggested questions */}
            <div className="space-y-2 w-full max-w-md">
              <h4 className="text-sm font-medium flex items-center gap-1.5 text-secondary-600 dark:text-gray-400">
                <SparklesIcon className="h-4 w-4" />
                Try asking about:
              </h4>
              <div className="flex flex-col space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left py-2 px-3 text-sm rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors text-secondary-700 dark:text-gray-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
              >
                <div className={`
                  flex items-start max-w-[85%] group
                  ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
                `}>
                  <div className={`
                    flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                    ${msg.role === 'user' 
                      ? 'bg-primary-500 text-white ml-2' 
                      : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 mr-2'}
                  `}>
                    {msg.role === 'user' 
                      ? <UserCircleIcon className="h-5 w-5" /> 
                      : <ChatBubbleLeftRightIcon className="h-5 w-5" />}
                  </div>
                  
                  <div className={`
                    py-3 px-4 rounded-2xl relative
                    ${msg.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : msg.error 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white'}
                  `}>
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    {/* Source citations for AI responses */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-secondary-200 dark:border-secondary-700">
                        <div className="text-xs font-medium flex items-center gap-1 text-secondary-600 dark:text-secondary-400 mb-1">
                          <LinkIcon className="h-3 w-3" />
                          Sources:
                        </div>
                        <div className="space-y-1">
                          {msg.sources.map((source, idx) => (
                            <div key={idx} className="text-xs flex items-center gap-1 text-primary-600 dark:text-primary-400">
                              <span>{source.title || source.filename || 'Document'}</span>
                              {source.page && <span className="text-secondary-500 dark:text-secondary-500">p.{source.page}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className={`
                        text-xs
                        ${msg.role === 'user' 
                          ? 'text-primary-200' 
                          : msg.error
                            ? 'text-red-500/70 dark:text-red-400/70'
                            : 'text-secondary-500 dark:text-secondary-400'}
                      `}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                      
                      {/* Copy button - only for assistant messages */}
                      {msg.role === 'assistant' && !msg.error && (
                        <button 
                          onClick={() => handleCopyToClipboard(msg.content, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-700"
                          aria-label="Copy to clipboard"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 mr-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </div>
                  <div className="py-3 px-5 rounded-2xl bg-secondary-100 dark:bg-secondary-800">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-secondary-400 dark:bg-secondary-500 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-secondary-400 dark:bg-secondary-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 rounded-full bg-secondary-400 dark:bg-secondary-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-secondary-700 pt-3">
        <div className="relative">
          <textarea
            ref={inputRef}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all resize-none"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading || isTyping}
            rows="2"
            aria-label="Chat message input"
          />
          <button
            className={`absolute right-2 bottom-2 p-2 rounded-full 
              ${(inputValue.trim() && !loading && !isTyping)
                ? 'bg-primary-500 text-white hover:bg-primary-600' 
                : 'bg-gray-200 dark:bg-secondary-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
              transition-colors`}
            onClick={handleSendMessage}
            disabled={loading || isTyping || !inputValue.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {(loading || isTyping) && (
          <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;


