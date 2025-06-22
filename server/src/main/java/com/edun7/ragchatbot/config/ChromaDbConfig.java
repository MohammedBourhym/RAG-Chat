package com.edun7.ragchatbot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.chromadb")
public class ChromaDbConfig {
    private String url;
    private String collectionName;
}
