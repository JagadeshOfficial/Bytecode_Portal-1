package com.bytecode.finance.service;

import com.bytecode.finance.model.FeeRecord;
import com.bytecode.finance.model.SalaryRecord;
import com.bytecode.finance.repository.FeeRepository;
import com.bytecode.finance.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FeeRepository feeRepository;
    private final SalaryRepository salaryRepository;

    public List<FeeRecord> getAllFeeRecords() {
        return feeRepository.findAll();
    }

    public FeeRecord updateFeeRecord(FeeRecord record) {
        return feeRepository.save(record);
    }

    public List<SalaryRecord> getAllSalaryRecords() {
        return salaryRepository.findAll();
    }

    public SalaryRecord processSalary(SalaryRecord record) {
        return salaryRepository.save(record);
    }
}
