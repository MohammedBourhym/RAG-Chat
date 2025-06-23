package com.edun7.ragchatbot.service.vectordb;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.edun7.ragchatbot.config.ElasticsearchConfig;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.BgeSmallEnEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@Primary
public class ElasticsearchVectorDbService implements VectorDbService {
    
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final ElasticsearchClient esClient;
    private final ElasticsearchConfig config;
    
    public ElasticsearchVectorDbService(ElasticsearchConfig config) {
        this.config = config;
        
        // Create the Elasticsearch client
        RestClient restClient = RestClient.builder(
                HttpHost.create(config.getUrl())
        ).build();
        
        ElasticsearchTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper());
                
        this.esClient = new ElasticsearchClient(transport);
        
        // Initialize the embedding store first
        try {
            this.embeddingStore = ElasticsearchEmbeddingStore.builder()
                    .serverUrl(config.getUrl())
                    .indexName(config.getIndex())
                    // Remove dimension setting - will use default from the library
                    .build();
                    
            log.info("Elasticsearch vector database service initialized with URL: {} and index: {}", 
                    config.getUrl(), config.getIndex());
                    
            // Create index if it doesn't exist
            initializeIndex(config.getIndex());
        } catch (Exception e) {
            log.error("Failed to initialize Elasticsearch embedding store", e);
            throw new RuntimeException("Failed to initialize Elasticsearch", e);
        }
        
        // Initialize the embedding model
        try {
            this.embeddingModel = new BgeSmallEnEmbeddingModel();
            log.info("Embedding model initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize embedding model", e);
            throw new RuntimeException("Failed to initialize embedding model", e);
        }
    }
    
    private void initializeIndex(String indexName) {
        try {
            boolean indexExists = esClient.indices().exists(builder -> 
                    builder.index(indexName)).value();
                    
            if (!indexExists) {
                log.info("Creating Elasticsearch index: {}", indexName);
                esClient.indices().create(builder -> 
                        builder.index(indexName)
                        .mappings(mappings -> 
                            mappings.properties("embedding", property -> 
                                property.denseVector(denseVector -> 
                                    denseVector.dims(384)
                                    .index(true)
                                    .similarity("cosine")
                                    .indexOptions(indexOptions -> 
                                        indexOptions.type("hnsw")
                                        .m(16)
                                        .efConstruction(100)
                                    )
                                )
                            )
                        )
                );
                log.info("Elasticsearch index created successfully");
            } else {
                log.info("Elasticsearch index already exists: {}", indexName);
            }
        } catch (IOException e) {
            log.error("Error initializing Elasticsearch index", e);
        }
    }
    
    @Override
    public void addSegment(TextSegment segment) {
        Embedding embedding = embeddingModel.embed(segment).content();
        embeddingStore.add(embedding, segment);
        log.debug("Added segment to Elasticsearch: {}", segment.text().substring(0, Math.min(50, segment.text().length())));
    }
    
    @Override
    public void addSegments(List<TextSegment> segments) {
        for (TextSegment segment : segments) {
            addSegment(segment);
        }
        log.info("Added {} segments to Elasticsearch", segments.size());
    }
    
    @Override
    public List<EmbeddingMatch<TextSegment>> search(String query, int maxResults) {
        try {
            // Embed the query text
            Embedding queryEmbedding = embeddingModel.embed(query).content();
            
            // Check if maxResults is greater than zero
            if (maxResults <= 0) {
                maxResults = 5; // Default to 5 results if invalid value provided
            }
            
            log.info("Searching for '{}' with maxResults={}", query, maxResults);
            
            List<EmbeddingMatch<TextSegment>> results = embeddingStore.findRelevant(queryEmbedding, maxResults);
            log.info("Search for '{}' returned {} results", query, results.size());
            return results;
        } catch (Exception e) {
            log.error("Error during vector search: {}", e.getMessage(), e);
            return List.of(); // Return empty list on error
        }
    }
    
    @Override
    public void clearAll() {
        try {
            String indexName = config.getIndex();
            boolean indexExists = esClient.indices().exists(builder -> 
                    builder.index(indexName)).value();
                    
            if (indexExists) {
                log.info("Deleting all documents from Elasticsearch index");
                esClient.deleteByQuery(d -> d
                    .index(indexName)
                    .query(q -> q.matchAll(m -> m)));
            }
        } catch (IOException e) {
            log.error("Error clearing Elasticsearch index", e);
        }
        
        log.info("Cleared all documents from Elasticsearch");
    }
    
    /**
     * Recreates the index - use this for troubleshooting if the index structure needs to be changed
     */
    public void recreateIndex() {
        String indexName = config.getIndex();
        try {
            boolean indexExists = esClient.indices().exists(builder -> 
                    builder.index(indexName)).value();
                    
            if (indexExists) {
                log.info("Deleting existing index: {}", indexName);
                esClient.indices().delete(builder -> builder.index(indexName));
            }
            
            // Recreate the index with proper settings
            initializeIndex(indexName);
            log.info("Index recreated successfully");
        } catch (IOException e) {
            log.error("Error recreating index", e);
        }
    }
}
