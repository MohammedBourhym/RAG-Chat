package com.edun7.ragchatbot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.elasticsearch")
public class ElasticsearchConfig {
    private String url;
    private String index;
}
