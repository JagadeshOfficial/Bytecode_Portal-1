package com.bytecode.course.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String tech; // e.g., Python, Java, Data Science
    private String duration; // e.g., 6 Months, 4 Months
    private String description;
    private Double price;
    private String image;
    private List<String> tags;
    private String level; // Beginner, Intermediate, Advanced
    private String mentor;
    private List<String> modules;
    private boolean active;
}
