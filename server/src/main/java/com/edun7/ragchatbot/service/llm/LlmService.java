package com.edun7.ragchatbot.service.llm;

import java.util.List;

public interface LlmService {
    /**
     * Generate a response from the LLM based on relevant document chunks and a user query
     */
    String generateResponse(List<String> relevantChunks, String userQuery);
    
    /**
     * Get the name of the LLM model being used
     */
    String getModelName();
}
