package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "notices")
public class Notice {
    @Id
    private String id;
    private String title;
    private String content;
    private String targetAudience; // ALL, STUDENTS, ADMIN
    private Date postedDate;
    private boolean active;
}
