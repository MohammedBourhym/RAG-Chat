import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getDocuments, deleteDocument } from '../services/api';

const DocumentList = ({ documents, setDocuments, refreshTrigger, onDocumentDeleted, compact = false }) => {
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
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-pulse flex space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <DocumentTextIcon className="h-12 w-12 mx-auto text-secondary-400 dark:text-secondary-600 mb-2" />
        <p className="text-secondary-600 dark:text-secondary-400">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
          Uploaded Documents
        </h2>
      )}
      
      <div className="divide-y divide-gray-200 dark:divide-secondary-700">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="py-3 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-secondary-800/50 rounded-lg px-2"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
              <div>
                <p className={`text-secondary-900 dark:text-white ${compact ? 'text-sm' : 'font-medium'}`}>
                  {doc.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {new Date(doc.uploadDate).toLocaleString()}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => handleDelete(doc.id)}
              className="text-secondary-400 hover:text-red-500 dark:text-secondary-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete document"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
