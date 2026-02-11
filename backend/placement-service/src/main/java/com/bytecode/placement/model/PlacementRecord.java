package com.bytecode.placement.model;

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
@Document(collection = "placement_records")
public class PlacementRecord {
    @Id
    private String id;
    private String studentName;
    private String studentEmail;
    private String companyName;
    private Double packageLPA;
    private String role;
    private Date placementDate;
}
