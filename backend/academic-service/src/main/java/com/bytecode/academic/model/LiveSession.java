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
@Document(collection = "live_sessions")
public class LiveSession {
    @Id
    private String id;
    private String title;
    private String description;
    private String mentorId;
    private String mentorName;
    private String courseId;
    private String courseName;
    private String batchId;
    private String batchName;
    private Date startTime;
    private Date endTime;
    private Integer duration; // in minutes
    private String meetingLink;
    private String meetingId;
    private String passcode;
    private String status; // UPCOMING, LIVE, COMPLETED, CANCELLED
    private String platform; // ZOOM, GOOGLE_MEET, MS_TEAMS
    private List<String> topics;
    private String recordingUrl;
    private Integer totalParticipants;
    private List<String> attendees; // student IDs
    private String notes;
    private List<String> resources; // URLs to shared materials
    private Date createdAt;
    private String branch;
}
