package com.edun7.ragchatbot.service;

import com.edun7.ragchatbot.service.document.DocumentService;
import com.edun7.ragchatbot.service.document.PDFDocumentService;
import com.edun7.ragchatbot.service.llm.LlmService;
import com.edun7.ragchatbot.service.vectordb.VectorDbService;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagService {
    
    private final DocumentService documentService;
    private final VectorDbService vectorDbService;
    private final LlmService llmService;
    
    /**
     * Process a document, extract text, and add segments to the vector database
     */
    public void processAndIndexDocument(String documentId) throws IOException {
        // Get document file
        File documentFile = ((PDFDocumentService) documentService).getDocumentById(documentId);
        if (documentFile == null || !documentFile.exists()) {
            throw new IOException("Document not found: " + documentId);
        }
        
        // Extract content
        String content = documentService.extractContent(documentFile);
        log.info("Extracted {} characters from document {}", content.length(), documentId);
        
        // Split content into segments
        List<TextSegment> segments = documentService.splitContent(content, 1024, 0);
        log.info("Split document into {} segments", segments.size());
        
        // Add segments to vector database
        vectorDbService.addSegments(segments);
        log.info("Added segments to vector database");
    }
    
    /**
     * Generate a response to a user query using the RAG process
     */
    public String generateResponse(String query) {
        // Search for relevant content
        List<EmbeddingMatch<TextSegment>> searchResults = vectorDbService.search(query, 5);
        
        if (searchResults.isEmpty()) {
            return "I don't have enough information to answer that question. Please upload relevant documents to help me provide a better answer.";
        }
        
        // Extract text from search results
        List<String> relevantChunks = searchResults.stream()
                .map(result -> result.embedded().text())
                .collect(Collectors.toList());
        
        // Generate response using LLM
        return llmService.generateResponse(relevantChunks, query);
    }
}
