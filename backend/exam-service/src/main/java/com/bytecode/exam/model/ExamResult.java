package com.bytecode.exam.model;

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
@Document(collection = "results")
public class ExamResult {
    @Id
    private String id;
    private String examId;
    private String studentEmail;
    private Integer score;
    private Integer totalQuestions;
    private boolean passed;
    private Date submittedAt;
}
