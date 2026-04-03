package com.bytecode.lead.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "leads")
public class Lead {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String course;
    private String source;
    private LeadStatus status = LeadStatus.NEW;
    private String assignedCounsellorId;
    private String assignedCounsellorName;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime followUpDate;
    private List<String> notes = new ArrayList<>();

    public enum LeadStatus {
        NEW, CONTACTED, INTERESTED, NOT_INTERESTED, CONVERTED
    }
}
