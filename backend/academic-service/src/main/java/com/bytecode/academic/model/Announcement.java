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
@Document(collection = "announcements")
public class Announcement {
    @Id
    private String id;
    private String title;
    private String content;
    private String type; // GENERAL, URGENT, EVENT, HOLIDAY, EXAM
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private String targetAudience; // ALL, STUDENTS, TRAINERS, SPECIFIC_BATCH
    private List<String> targetBatchIds;
    private List<String> targetCourseIds;
    private String createdBy;
    private String createdByName;
    private Date createdAt;
    private Date expiryDate;
    private Boolean isPinned;
    private List<String> attachments;
    private Integer viewCount;
    private String branch;
}
