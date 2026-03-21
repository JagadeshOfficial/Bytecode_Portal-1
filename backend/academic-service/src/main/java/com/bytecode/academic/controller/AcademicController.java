package com.bytecode.academic.controller;

import com.bytecode.academic.model.*;
import com.bytecode.academic.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AcademicController {

    private final AcademicService academicService;

    // ========== NOTICES ==========
    @GetMapping("/notices")
    public List<Notice> getNotices() {
        return academicService.getAllActiveNotices();
    }

    @PostMapping("/notices")
    public Notice postNotice(@RequestBody Notice notice) {
        return academicService.postNotice(notice);
    }

    // ========== LIVE SESSIONS ==========
    @GetMapping("/sessions")
    public List<LiveSession> getSessions() {
        return academicService.getLiveSessions();
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<LiveSession> getSessionById(@PathVariable("id") String id) {
        return academicService.getSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/sessions")
    public LiveSession createSession(@RequestBody LiveSession session) {
        return academicService.createSession(session);
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<LiveSession> updateSession(@PathVariable("id") String id, @RequestBody LiveSession session) {
        try {
            return ResponseEntity.ok(academicService.updateSession(id, session));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable("id") String id) {
        academicService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sessions/batch/{batchId}")
    public List<LiveSession> getSessionsByBatch(@PathVariable("batchId") String batchId) {
        return academicService.getSessionsByBatch(batchId);
    }

    @GetMapping("/sessions/status/{status}")
    public List<LiveSession> getSessionsByStatus(@PathVariable("status") String status) {
        return academicService.getSessionsByStatus(status);
    }

    // ========== ATTENDANCE ==========
    @PostMapping("/attendance")
    public Attendance markAttendance(@RequestBody Attendance attendance) {
        return academicService.markAttendance(attendance);
    }

    @GetMapping("/attendance/student/{studentId}")
    public List<Attendance> getAttendanceByStudent(@PathVariable String studentId) {
        return academicService.getAttendanceByStudent(studentId);
    }

    // ========== BATCHES ==========
    @GetMapping("/batches")
    public List<Batch> getAllBatches() {
        return academicService.getAllBatches();
    }

    @GetMapping("/batches/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable("id") String id) {
        return academicService.getBatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/batches")
    public Batch createBatch(@RequestBody Batch batch) {
        return academicService.createBatch(batch);
    }

    @PutMapping("/batches/{id}")
    public ResponseEntity<Batch> updateBatch(@PathVariable("id") String id, @RequestBody Batch batch) {
        try {
            return ResponseEntity.ok(academicService.updateBatch(id, batch));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/batches/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable("id") String id) {
        academicService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/batches/course/{courseId}")
    public List<Batch> getBatchesByCourse(@PathVariable("courseId") String courseId) {
        return academicService.getBatchesByCourse(courseId);
    }

    @GetMapping("/batches/trainer/{trainerId}")
    public List<Batch> getBatchesByTrainer(@PathVariable("trainerId") String trainerId) {
        return academicService.getBatchesByTrainer(trainerId);
    }

    @GetMapping("/batches/student/{studentId}")
    public List<Batch> getBatchesByStudent(@PathVariable("studentId") String studentId) {
        return academicService.getBatchesByStudent(studentId);
    }

    @GetMapping("/batches/status/{status}")
    public List<Batch> getBatchesByStatus(@PathVariable("status") String status) {
        return academicService.getBatchesByStatus(status);
    }

    // ========== ASSIGNMENTS ==========
    @GetMapping("/assignments")
    public List<Assignment> getAllAssignments() {
        return academicService.getAllAssignments();
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable("id") String id) {
        return academicService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/assignments")
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return academicService.createAssignment(assignment);
    }

    @PutMapping("/assignments/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable("id") String id,
            @RequestBody Assignment assignment) {
        try {
            return ResponseEntity.ok(academicService.updateAssignment(id, assignment));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/assignments/batch/{batchId}")
    public List<Assignment> getAssignmentsByBatch(@PathVariable("batchId") String batchId) {
        return academicService.getAssignmentsByBatch(batchId);
    }

    @GetMapping("/assignments/course/{courseId}")
    public List<Assignment> getAssignmentsByCourse(@PathVariable("courseId") String courseId) {
        return academicService.getAssignmentsByCourse(courseId);
    }

    // ========== CURRICULUM ==========
    @GetMapping("/curriculum")
    public List<Curriculum> getAllCurriculum() {
        return academicService.getAllCurriculum();
    }

    @GetMapping("/curriculum/{id}")
    public ResponseEntity<Curriculum> getCurriculumById(@PathVariable("id") String id) {
        return academicService.getCurriculumById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/curriculum/course/{courseId}")
    public ResponseEntity<Curriculum> getActiveCurriculumByCourse(@PathVariable("courseId") String courseId) {
        return academicService.getActiveCurriculumByCourse(courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/curriculum")
    public Curriculum createCurriculum(@RequestBody Curriculum curriculum) {
        return academicService.createCurriculum(curriculum);
    }

    @PutMapping("/curriculum/{id}")
    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable("id") String id,
            @RequestBody Curriculum curriculum) {
        try {
            return ResponseEntity.ok(academicService.updateCurriculum(id, curriculum));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== ANNOUNCEMENTS ==========
    @GetMapping("/announcements")
    public List<Announcement> getAllAnnouncements() {
        return academicService.getAllAnnouncements();
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable("id") String id) {
        return academicService.getAnnouncementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/announcements")
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return academicService.createAnnouncement(announcement);
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable("id") String id,
            @RequestBody Announcement announcement) {
        try {
            return ResponseEntity.ok(academicService.updateAnnouncement(id, announcement));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/announcements/pinned")
    public List<Announcement> getPinnedAnnouncements() {
        return academicService.getPinnedAnnouncements();
    }

    @GetMapping("/announcements/type/{type}")
    public List<Announcement> getAnnouncementsByType(@PathVariable("type") String type) {
        return academicService.getAnnouncementsByType(type);
    }
}
