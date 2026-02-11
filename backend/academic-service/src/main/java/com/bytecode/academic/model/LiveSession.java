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
@Document(collection = "live_sessions")
public class LiveSession {
    @Id
    private String id;
    private String title;
    private String mentorName;
    private String courseId;
    private Date startTime;
    private String meetingLink;
    private String status; // UPCOMING, LIVE, COMPLETED
}
