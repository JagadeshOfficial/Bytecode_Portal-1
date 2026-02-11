package com.bytecode.exam.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    private String questionText;
    private List<String> options;
    private Integer correctOptionIndex;
    private String category; // e.g., Java, Aptitude, Python
    private String difficulty; // Easy, Medium, Hard
}
