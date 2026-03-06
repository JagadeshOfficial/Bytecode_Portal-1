package com.bytecode.exam.config;

import com.bytecode.exam.model.Exam;
import com.bytecode.exam.model.ExamResult;
import com.bytecode.exam.model.Question;
import com.bytecode.exam.repository.ExamRepository;
import com.bytecode.exam.repository.QuestionRepository;
import com.bytecode.exam.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;

    @Override
    public void run(String... args) {
        if (examRepository.count() > 0) {
            log.info("Exam data already exists, skipping seeding.");
            return;
        }

        log.info("Seeding Exam data...");

        // 1. Seed Questions
        List<Question> questions = Arrays.asList(
                Question.builder()
                        .questionText("What is the parent class of all classes in Java?")
                        .options(Arrays.asList("Class", "Object", "System", "Main"))
                        .correctOptionIndex(1)
                        .category("Java")
                        .difficulty("Easy")
                        .build(),
                Question.builder()
                        .questionText("Which of these is not a primitive data type in Java?")
                        .options(Arrays.asList("int", "float", "boolean", "String"))
                        .correctOptionIndex(3)
                        .category("Java")
                        .difficulty("Easy")
                        .build(),
                Question.builder()
                        .questionText("In Python, which keyword is used to define a function?")
                        .options(Arrays.asList("func", "define", "def", "function"))
                        .correctOptionIndex(2)
                        .category("Python")
                        .difficulty("Easy")
                        .build(),
                Question.builder()
                        .questionText("What does SQL stand for?")
                        .options(Arrays.asList("Structured Query Language", "Simple Query Language",
                                "Strong Query Language", "Structured Question Language"))
                        .correctOptionIndex(0)
                        .category("Database")
                        .difficulty("Easy")
                        .build());

        List<Question> savedQuestions = questionRepository.saveAll(questions);
        List<String> javaQuestionIds = savedQuestions.stream()
                .filter(q -> q.getCategory().equals("Java"))
                .map(Question::getId)
                .collect(Collectors.toList());

        // 2. Seed Exams
        Exam javaExam = Exam.builder()
                .title("Java Fundamentals Quiz")
                .description("Test your basic Java knowledge.")
                .durationMinutes(30)
                .totalMarks(10)
                .passingMarks(4)
                .questionIds(javaQuestionIds)
                .active(true)
                .build();

        Exam savedJavaExam = examRepository.save(javaExam);

        // 3. Seed Results
        List<ExamResult> results = Arrays.asList(
                ExamResult.builder()
                        .examId(savedJavaExam.getId())
                        .studentEmail("student1@example.com")
                        .score(8)
                        .totalQuestions(javaQuestionIds.size())
                        .passed(true)
                        .submittedAt(new Date())
                        .build(),
                ExamResult.builder()
                        .examId(savedJavaExam.getId())
                        .studentEmail("student2@example.com")
                        .score(3)
                        .totalQuestions(javaQuestionIds.size())
                        .passed(false)
                        .submittedAt(new Date())
                        .build());

        resultRepository.saveAll(results);
        log.info("Exam data seeding completed.");
    }
}
