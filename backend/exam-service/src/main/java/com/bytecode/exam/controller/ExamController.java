package com.bytecode.exam.controller;

import com.bytecode.exam.dto.ExamSubmission;
import com.bytecode.exam.model.Exam;
import com.bytecode.exam.model.ExamResult;
import com.bytecode.exam.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public List<Exam> getExams() {
        return examService.getAllExams();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExam(@PathVariable String id) {
        return examService.getExamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamResult> submitExam(@RequestBody ExamSubmission submission) {
        return ResponseEntity.ok(examService.processSubmission(submission));
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.createExam(exam);
    }
}
