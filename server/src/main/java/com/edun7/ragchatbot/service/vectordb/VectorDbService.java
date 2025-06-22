package com.edun7.ragchatbot.service.vectordb;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;

import java.util.List;

public interface VectorDbService {
    /**
     * Add a text segment to the vector database
     */
    void addSegment(TextSegment segment);
    
    /**
     * Add multiple text segments to the vector database
     */
    void addSegments(List<TextSegment> segments);
    
    /**
     * Search for relevant segments based on a query
     */
    List<EmbeddingMatch<TextSegment>> search(String query, int maxResults);
    
    /**
     * Delete all segments from the vector database
     */
    void clearAll();
}
