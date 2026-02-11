package com.bytecode.finance.controller;

import com.bytecode.finance.model.FeeRecord;
import com.bytecode.finance.model.SalaryRecord;
import com.bytecode.finance.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/fees")
    public List<FeeRecord> getFees() {
        return financeService.getAllFeeRecords();
    }

    @PostMapping("/fees")
    public FeeRecord updateFee(@RequestBody FeeRecord record) {
        return financeService.updateFeeRecord(record);
    }

    @GetMapping("/salaries")
    public List<SalaryRecord> getSalaries() {
        return financeService.getAllSalaryRecords();
    }

    @PostMapping("/salaries/process")
    public SalaryRecord processSalary(@RequestBody SalaryRecord record) {
        return financeService.processSalary(record);
    }
}
