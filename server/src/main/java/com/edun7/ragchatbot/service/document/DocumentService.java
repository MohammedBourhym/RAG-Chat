package com.edun7.ragchatbot.service.document;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.edun7.ragchatbot.model.DocumentInfo;

import dev.langchain4j.data.segment.TextSegment;

public interface DocumentService {
    /**
     * Process and store a document
     */
    DocumentInfo processDocument(MultipartFile file) throws IOException;
    
    /**
     * Get information about all stored documents
     */
    List<DocumentInfo> getAllDocuments();
    
    /**
     * Delete a document by ID
     */
    boolean deleteDocument(String documentId);
    
    /**
     * Extract text content from a document file
     */
    String extractContent(File file) throws IOException;
    
    /**
     * Split document content into text segments
     */
    List<TextSegment> splitContent(String content, int maxSegmentSize, int overlap);
}
