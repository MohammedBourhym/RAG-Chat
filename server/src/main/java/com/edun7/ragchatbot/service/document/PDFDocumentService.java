package com.edun7.ragchatbot.service.document;

import com.edun7.ragchatbot.model.DocumentInfo;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.segment.TextSegment;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PDFDocumentService implements DocumentService {
    
    private static final int DEFAULT_MAX_SEGMENT_SIZE = 1024;
    private static final int DEFAULT_OVERLAP = 0;
    
    @Value("${app.upload.dir}")
    private String uploadDir;
    
    private final List<DocumentInfo> documents = new ArrayList<>();
    
    @Override
    public DocumentInfo processDocument(MultipartFile file) throws IOException {
        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueId = UUID.randomUUID().toString();
        String filename = uniqueId + fileExtension;
        
        // Save the file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create document info
        DocumentInfo documentInfo = DocumentInfo.builder()
                .id(uniqueId)
                .name(originalFilename)
                .type(file.getContentType())
                .size(file.getSize())
                .uploadDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
        
        documents.add(documentInfo);
        
        return documentInfo;
    }
    
    @Override
    public List<DocumentInfo> getAllDocuments() {
        return documents;
    }
    
    @Override
    public boolean deleteDocument(String documentId) {
        return documents.removeIf(doc -> doc.getId().equals(documentId));
    }
    
    @Override
    public String extractContent(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }
    
    @Override
    public List<TextSegment> splitContent(String content, int maxSegmentSize, int overlap) {
        Document document = new Document(content, new Metadata());
        DocumentSplitter splitter = new DocumentByParagraphSplitter(maxSegmentSize, overlap);
        return splitter.split(document);
    }
    
    /**
     * Split content using default parameters
     */
    public List<TextSegment> splitContent(String content) {
        return splitContent(content, DEFAULT_MAX_SEGMENT_SIZE, DEFAULT_OVERLAP);
    }
    
    /**
     * Get a document file by its ID
     */
    public File getDocumentById(String documentId) {
        return documents.stream()
                .filter(doc -> doc.getId().equals(documentId))
                .findFirst()
                .map(doc -> {
                    String fileExtension = doc.getName().substring(doc.getName().lastIndexOf("."));
                    String filename = documentId + fileExtension;
                    return Paths.get(uploadDir, filename).toFile();
                })
                .orElse(null);
    }
}
