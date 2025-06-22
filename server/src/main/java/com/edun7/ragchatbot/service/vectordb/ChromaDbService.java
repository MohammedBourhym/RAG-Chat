package com.edun7.ragchatbot.service.vectordb;

import com.edun7.ragchatbot.config.ChromaDbConfig;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ChromaDbService implements VectorDbService {
    
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    
    public ChromaDbService(ChromaDbConfig config) {
        this.embeddingStore = ChromaEmbeddingStore.builder()
                .baseUrl(config.getUrl())
                .collectionName(config.getCollectionName())
                .build();
        
        this.embeddingModel = new AllMiniLmL6V2EmbeddingModel();
        log.info("ChromaDB service initialized with URL: {} and collection: {}", 
                config.getUrl(), config.getCollectionName());
    }
    
    @Override
    public void addSegment(TextSegment segment) {
        Embedding embedding = embeddingModel.embed(segment).content();
        embeddingStore.add(embedding, segment);
        log.debug("Added segment to ChromaDB: {}", segment.text().substring(0, Math.min(50, segment.text().length())));
    }
    
    @Override
    public void addSegments(List<TextSegment> segments) {
        for (TextSegment segment : segments) {
            addSegment(segment);
        }
        log.info("Added {} segments to ChromaDB", segments.size());
    }
    
    @Override
    public List<EmbeddingMatch<TextSegment>> search(String query, int maxResults) {
        Embedding queryEmbedding = embeddingModel.embed(query).content();
        List<EmbeddingMatch<TextSegment>> results = embeddingStore.findRelevant(queryEmbedding, maxResults);
        log.info("Search for '{}' returned {} results", query, results.size());
        return results;
    }
    
    @Override
    public void clearAll() {
        embeddingStore.removeAll();
        log.info("Cleared all documents from ChromaDB");
    }
}
