package com.bytecode.exam.service;

import com.bytecode.exam.dto.ExamSubmission;
import com.bytecode.exam.model.Exam;
import com.bytecode.exam.model.ExamResult;
import com.bytecode.exam.model.Question;
import com.bytecode.exam.repository.ExamRepository;
import com.bytecode.exam.repository.QuestionRepository;
import com.bytecode.exam.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Optional<Exam> getExamById(String id) {
        return examRepository.findById(id);
    }

    public List<ExamResult> getAllResults() {
        return resultRepository.findAll();
    }

    public ExamResult processSubmission(ExamSubmission submission) {
        Exam exam = examRepository.findById(submission.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        int score = 0;
        Map<String, Integer> answers = submission.getAnswers();

        for (String qId : exam.getQuestionIds()) {
            Question question = questionRepository.findById(qId).orElse(null);
            if (question != null && answers.containsKey(qId)) {
                if (question.getCorrectOptionIndex().equals(answers.get(qId))) {
                    score++;
                }
            }
        }

        ExamResult result = ExamResult.builder()
                .examId(exam.getId())
                .studentEmail(submission.getStudentEmail())
                .score(score)
                .totalQuestions(exam.getQuestionIds().size())
                .passed(score >= exam.getPassingMarks())
                .submittedAt(new Date())
                .build();

        return resultRepository.save(result);
    }

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }
}
