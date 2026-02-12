package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "assignments")
public class Assignment {
    @Id
    private String id;
    private String title;
    private String description;
    private String courseId;
    private String courseName;
    private String batchId;
    private String batchName;
    private String trainerId;
    private String trainerName;
    private Date assignedDate;
    private Date dueDate;
    private Integer totalMarks;
    private String difficulty; // EASY, MEDIUM, HARD
    private List<String> attachments; // URLs to files
    private String instructions;
    private List<Submission> submissions;
    private String status; // ACTIVE, CLOSED, GRADED
    private Date createdAt;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Submission {
        private String studentId;
        private String studentName;
        private Date submittedAt;
        private List<String> files;
        private String remarks;
        private Integer marksObtained;
        private String feedback;
        private String status; // PENDING, SUBMITTED, GRADED, LATE
    }
}
