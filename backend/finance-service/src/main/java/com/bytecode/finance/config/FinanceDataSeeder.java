package com.bytecode.finance.config;

import com.bytecode.finance.model.FeeRecord;
import com.bytecode.finance.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FinanceDataSeeder implements CommandLineRunner {

    private final FeeRepository repository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            System.out.println("Seeding Fee Records...");

            // Helper to get dates
            Calendar cal = Calendar.getInstance();

            // Current Month
            Date now = new Date();

            // Last Month
            cal.add(Calendar.MONTH, -1);
            Date lastMonth = cal.getTime();

            // 2 Months Ago
            cal.add(Calendar.MONTH, -1);
            Date twoMonthsAgo = cal.getTime();

            List<FeeRecord> records = List.of(
                    FeeRecord.builder()
                            .studentEmail("student1@example.com")
                            .totalAmount(50000.0)
                            .paidAmount(25000.0)
                            .balanceAmount(25000.0)
                            .status("PARTIAL")
                            .lastPaymentDate(now)
                            .build(),
                    FeeRecord.builder()
                            .studentEmail("student2@example.com")
                            .totalAmount(40000.0)
                            .paidAmount(40000.0)
                            .balanceAmount(0.0)
                            .status("PAID")
                            .lastPaymentDate(lastMonth)
                            .build(),
                    FeeRecord.builder()
                            .studentEmail("student3@example.com")
                            .totalAmount(60000.0)
                            .paidAmount(10000.0)
                            .balanceAmount(50000.0)
                            .status("PARTIAL")
                            .lastPaymentDate(now)
                            .build(),
                    FeeRecord.builder()
                            .studentEmail("student4@example.com")
                            .totalAmount(30000.0)
                            .paidAmount(30000.0)
                            .balanceAmount(0.0)
                            .status("PAID")
                            .lastPaymentDate(twoMonthsAgo)
                            .build(),
                    FeeRecord.builder()
                            .studentEmail("student5@example.com")
                            .totalAmount(50000.0)
                            .paidAmount(5000.0)
                            .balanceAmount(45000.0)
                            .status("PENDING")
                            .lastPaymentDate(lastMonth)
                            .build());
            repository.saveAll(records);
            System.out.println("Seeded " + records.size() + " fee records.");
        }
    }
}
