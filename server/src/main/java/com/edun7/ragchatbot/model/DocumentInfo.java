package com.edun7.ragchatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentInfo {
    private String id;
    private String name;
    private String type;
    private long size;
    private String uploadDate;
}
