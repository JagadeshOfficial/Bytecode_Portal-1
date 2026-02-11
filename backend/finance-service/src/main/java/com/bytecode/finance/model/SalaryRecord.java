package com.bytecode.finance.model;

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
@Document(collection = "salary_records")
public class SalaryRecord {
    @Id
    private String id;
    private String employeeEmail;
    private Double baseSalary;
    private Double bonuses;
    private Double deductions;
    private String month;
    private String year;
    private String paymentStatus; // PAID, PROCESSING, HOLD
    private Date paymentDate;
}
