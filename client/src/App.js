import React, { useState, useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Header from './components/Header';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';
import DocumentList from './components/DocumentList';
import { 
  ChatBubbleLeftRightIcon, 
  DocumentArrowUpIcon, 
  FolderIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

function App() {
  const { darkMode } = useContext(ThemeContext);
  const [documents, setDocuments] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeView, setActiveView] = useState('welcome'); // welcome, chat, upload, documents

  const handleDocumentUploaded = () => {
    // Trigger a refresh of the document list
    setRefreshTrigger(prev => prev + 1);
    // Switch to documents view after upload
    setActiveView('documents');
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className="flex-grow px-4 py-6 container mx-auto">
        {activeView === 'welcome' && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 fade-in">
            <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-8">
              Welcome to <span className="text-primary-500">EduN7 RAG Chatbot</span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-gray-300 max-w-2xl mb-12">
              Your intelligent assistant for document-based Q&A. Upload documents, ask questions, and get accurate responses based on your content.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
              <button 
                onClick={() => setActiveView('chat')}
                className="card flex flex-col items-center p-6 hover:scale-105 transition-transform"
              >
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-primary-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Ask AI</h2>
                <p className="text-secondary-600 dark:text-gray-300 text-sm">
                  Chat with the AI about your documents
                </p>
              </button>
              
              <button 
                onClick={() => setActiveView('upload')}
                className="card flex flex-col items-center p-6 hover:scale-105 transition-transform"
              >
                <DocumentArrowUpIcon className="h-12 w-12 text-primary-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upload File</h2>
                <p className="text-secondary-600 dark:text-gray-300 text-sm">
                  Add new documents to the knowledge base
                </p>
              </button>
              
              <button 
                onClick={() => setActiveView('documents')}
                className="card flex flex-col items-center p-6 hover:scale-105 transition-transform"
              >
                <FolderIcon className="h-12 w-12 text-primary-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">My Documents</h2>
                <p className="text-secondary-600 dark:text-gray-300 text-sm">
                  View and manage your uploaded documents
                </p>
              </button>
              
              <button 
                className="card flex flex-col items-center p-6 hover:scale-105 transition-transform"
              >
                <UserCircleIcon className="h-12 w-12 text-primary-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">My Profile</h2>
                <p className="text-secondary-600 dark:text-gray-300 text-sm">
                  Manage your account settings
                </p>
              </button>
            </div>
          </div>
        )}
        
        {activeView !== 'welcome' && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setActiveView('welcome')}
                className="button-secondary"
                aria-label="Back to Home"
              >
                Back to Home
              </button>
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                {activeView === 'chat' && 'Chat with AI'}
                {activeView === 'upload' && 'Upload Documents'}
                {activeView === 'documents' && 'My Documents'}
              </h2>
            </div>
            
            {activeView === 'documents' && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveView('upload')} 
                  className="button-secondary flex items-center space-x-1"
                >
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  <span>Upload More</span>
                </button>
                <button 
                  onClick={() => setActiveView('chat')} 
                  className="button-primary flex items-center space-x-1"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span>Start Chatting</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'upload' && (
          <div className="card fade-in">
            <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
          </div>
        )}
        
        {activeView === 'documents' && (
          <div className="card h-[500px] overflow-auto fade-in">
            <DocumentList 
              documents={documents}
              setDocuments={setDocuments}
              refreshTrigger={refreshTrigger}
              onDocumentDeleted={handleDocumentUploaded}
            />
          </div>
        )}
        
        {activeView === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 fade-in">
            <div className="lg:col-span-1 card h-[800px] overflow-auto">
              <h3 className="text-lg font-semibold mb-4">My Documents</h3>
              <DocumentList 
                documents={documents}
                setDocuments={setDocuments}
                refreshTrigger={refreshTrigger}
                onDocumentDeleted={handleDocumentUploaded}
                compact={true}
              />
            </div>
            
            <div className="lg:col-span-3 card h-[800px] flex flex-col">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-secondary-700 py-4 text-center text-secondary-600 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} EduN7 RAG Chatbot. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
