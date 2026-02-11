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
@Document(collection = "fee_records")
public class FeeRecord {
    @Id
    private String id;
    private String studentEmail;
    private Double totalAmount;
    private Double paidAmount;
    private Double balanceAmount;
    private String status; // PAID, PARTIAL, PENDING
    private Date lastPaymentDate;
}
