package com.bytecode.placement.model;

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
@Document(collection = "job_listings")
public class JobListing {
    @Id
    private String id;
    private String companyName;
    private String jobTitle;
    private String location;
    private Double salaryPackage;
    private String eligibility;
    private Date driveDate;
    private List<String> skillsRequired;
    private boolean active;
}
