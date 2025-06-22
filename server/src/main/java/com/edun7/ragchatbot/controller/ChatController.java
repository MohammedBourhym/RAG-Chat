package com.edun7.ragchatbot.controller;

import com.edun7.ragchatbot.model.ChatRequest;
import com.edun7.ragchatbot.model.ChatResponse;
import com.edun7.ragchatbot.service.RagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final RagService ragService;
    
    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request.getQuery());
        
        try {
            String response = ragService.generateResponse(request.getQuery());
            
            return ResponseEntity.ok(ChatResponse.builder()
                    .message(response)
                    .success(true)
                    .timestamp(Instant.now().toEpochMilli())
                    .build());
                    
        } catch (Exception e) {
            log.error("Error processing chat request", e);
            
            return ResponseEntity.ok(ChatResponse.builder()
                    .message("An error occurred while processing your request: " + e.getMessage())
                    .success(false)
                    .timestamp(Instant.now().toEpochMilli())
                    .build());
        }
    }
}
