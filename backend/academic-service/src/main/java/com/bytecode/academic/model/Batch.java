package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "batches")
public class Batch {
    @Id
    private String id;
    private String batchCode;
    private String batchName;
    private String courseId;
    private String courseName;
    private String trainerId;
    private String trainerName;
    private Date startDate;
    private Date endDate;
    private String status; // UPCOMING, ONGOING, COMPLETED
    private Integer totalStudents;
    private List<String> studentIds;
    private String schedule; // e.g., "Mon-Fri 10:00 AM - 1:00 PM"
    private String mode; // ONLINE, OFFLINE, HYBRID
    private String branch;
    private Integer maxCapacity;
    private String description;
    @Builder.Default
    private List<BatchFolder> folders = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;
}
