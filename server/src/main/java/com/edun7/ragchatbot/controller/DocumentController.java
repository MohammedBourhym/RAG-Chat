package com.edun7.ragchatbot.controller;

import com.edun7.ragchatbot.model.DocumentInfo;
import com.edun7.ragchatbot.service.RagService;
import com.edun7.ragchatbot.service.document.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {
    
    private final DocumentService documentService;
    private final RagService ragService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadDocument(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            log.info("Received file upload request: {}, size: {}, type: {}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());
            
            if (file.isEmpty()) {
                log.warn("Empty file received");
                response.put("success", false);
                response.put("message", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if file is a PDF
            if (!"application/pdf".equals(file.getContentType())) {
                log.warn("Non-PDF file received: {}", file.getContentType());
                response.put("success", false);
                response.put("message", "Only PDF files are supported. Received: " + file.getContentType());
                return ResponseEntity.badRequest().body(response);
            }
            
            // Process and store the document
            DocumentInfo documentInfo = documentService.processDocument(file);
            log.info("Document processed with ID: {}", documentInfo.getId());
            
            // Index the document for RAG
            ragService.processAndIndexDocument(documentInfo.getId());
            log.info("Document indexed successfully");
            
            response.put("success", true);
            response.put("message", "Document uploaded and indexed successfully");
            response.put("document", documentInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Error uploading document", e);
            response.put("success", false);
            response.put("message", "Failed to upload document: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            log.error("Unexpected error during document upload", e);
            response.put("success", false);
            response.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<DocumentInfo>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
    
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable String documentId) {
        Map<String, Object> response = new HashMap<>();
        
        boolean deleted = documentService.deleteDocument(documentId);
        
        if (deleted) {
            response.put("success", true);
            response.put("message", "Document deleted successfully");
        } else {
            response.put("success", false);
            response.put("message", "Document not found or could not be deleted");
        }
        
        return ResponseEntity.ok(response);
    }
}
