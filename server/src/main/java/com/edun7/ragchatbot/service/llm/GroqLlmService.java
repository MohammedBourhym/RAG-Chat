package com.edun7.ragchatbot.service.llm;

import com.edun7.ragchatbot.config.GroqConfig;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GroqLlmService implements LlmService {
    
    private final GroqConfig config;
    private final RestTemplate restTemplate;
    private final Gson gson;
    
    public GroqLlmService(GroqConfig config) {
        this.config = config;
        this.restTemplate = new RestTemplate();
        this.gson = new Gson();
    }
    
    @Override
    public String generateResponse(List<String> relevantChunks, String userQuery) {
        try {
            // Create system prompt with relevant context
            String context = relevantChunks.stream()
                    .collect(Collectors.joining("\n\n"));
            
            String systemPrompt = "You are an educational assistant that answers questions based on the provided context information. " +
                    "Given the context information and no prior knowledge, answer the query.\n\n" +
                    "Context:\n" + context + "\n\n" +
                    "Follow these rules:\n" +
                    "1. If the answer is not in the context, just say that you don't know.\n" +
                    "2. Avoid statements like 'Based on the context...' or 'The provided information...'\n" +
                    "3. Give direct, factual answers based only on the context provided.\n" +
                    "4. Do not make up information that is not in the context.\n" +
                    "5. Answer the question as concisely as possible while providing the necessary details.";
            
            // Prepare request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + config.getApiKey());
            
            // Prepare request body
            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("model", config.getModel());
            
            JsonArray messages = new JsonArray();
            
            // Add system message
            JsonObject systemMessage = new JsonObject();
            systemMessage.addProperty("role", "system");
            systemMessage.addProperty("content", systemPrompt);
            messages.add(systemMessage);
            
            // Add user message
            JsonObject userMessage = new JsonObject();
            userMessage.addProperty("role", "user");
            userMessage.addProperty("content", userQuery);
            messages.add(userMessage);
            
            requestBody.add("messages", messages);
            
            // Send request to Groq API
            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions", 
                    request, 
                    String.class);
            
            // Parse response
            JsonObject responseJson = gson.fromJson(response.getBody(), JsonObject.class);
            JsonArray choices = responseJson.getAsJsonArray("choices");
            if (choices != null && choices.size() > 0) {
                JsonObject choice = choices.get(0).getAsJsonObject();
                JsonObject message = choice.getAsJsonObject("message");
                if (message != null && message.has("content")) {
                    return message.get("content").getAsString();
                }
            }
            
            return "Failed to get a response from the LLM.";
            
        } catch (Exception e) {
            log.error("Error generating response from Groq API", e);
            return "An error occurred while generating a response: " + e.getMessage();
        }
    }
    
    @Override
    public String getModelName() {
        return config.getModel();
    }
}
