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
@Document(collection = "attendance")
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String studentEmail;
    private String sessionId;
    private String batchId;
    private Date date;
    private Date markedAt;
    private Boolean present;
    private String remarks;
}
