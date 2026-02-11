package com.bytecode.exam.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ExamSubmission {
    private String examId;
    private String studentEmail;
    private Map<String, Integer> answers; // questionId -> selectedOptionIndex
}
