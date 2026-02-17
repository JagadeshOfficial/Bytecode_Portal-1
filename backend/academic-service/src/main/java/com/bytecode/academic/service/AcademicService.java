package com.bytecode.academic.service;

import com.bytecode.academic.model.*;
import com.bytecode.academic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final LiveSessionRepository liveSessionRepository;
    private final NoticeRepository noticeRepository;
    private final AttendanceRepository attendanceRepository;
    private final BatchRepository batchRepository;
    private final AssignmentRepository assignmentRepository;
    private final CurriculumRepository curriculumRepository;
    private final AnnouncementRepository announcementRepository;

    // ========== NOTICES ==========
    public List<Notice> getAllActiveNotices() {
        return noticeRepository.findAll();
    }

    public Notice postNotice(Notice notice) {
        notice.setCreatedAt(new Date());
        return noticeRepository.save(notice);
    }

    // ========== LIVE SESSIONS ==========
    public List<LiveSession> getLiveSessions() {
        return liveSessionRepository.findAll();
    }

    public Optional<LiveSession> getSessionById(String id) {
        return liveSessionRepository.findById(id);
    }

    public LiveSession createSession(LiveSession session) {
        session.setCreatedAt(new Date());
        return liveSessionRepository.save(session);
    }

    public LiveSession updateSession(String id, LiveSession session) {
        LiveSession existing = liveSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setId(id);
        session.setCreatedAt(existing.getCreatedAt());
        return liveSessionRepository.save(session);
    }

    public List<LiveSession> getSessionsByBatch(String batchId) {
        return liveSessionRepository.findByBatchId(batchId);
    }

    public List<LiveSession> getSessionsByStatus(String status) {
        return liveSessionRepository.findByStatus(status);
    }

    public void deleteSession(String id) {
        liveSessionRepository.deleteById(id);
    }

    // ========== ATTENDANCE ==========
    public Attendance markAttendance(Attendance attendance) {
        attendance.setMarkedAt(new Date());
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByStudent(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    // ========== BATCHES ==========
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Optional<Batch> getBatchById(String id) {
        return batchRepository.findById(id);
    }

    public Batch createBatch(Batch batch) {
        batch.setCreatedAt(new Date());
        batch.setUpdatedAt(new Date());
        return batchRepository.save(batch);
    }

    public Batch updateBatch(String id, Batch batch) {
        Batch existing = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        batch.setId(id);
        batch.setCreatedAt(existing.getCreatedAt());
        batch.setUpdatedAt(new Date());
        return batchRepository.save(batch);
    }

    public List<Batch> getBatchesByCourse(String courseId) {
        return batchRepository.findByCourseId(courseId);
    }

    public List<Batch> getBatchesByTrainer(String trainerId) {
        return batchRepository.findByTrainerId(trainerId);
    }

    public List<Batch> getBatchesByStatus(String status) {
        return batchRepository.findByStatus(status);
    }

    public void deleteBatch(String id) {
        batchRepository.deleteById(id);
    }

    // ========== ASSIGNMENTS ==========
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(String id) {
        return assignmentRepository.findById(id);
    }

    public Assignment createAssignment(Assignment assignment) {
        assignment.setCreatedAt(new Date());
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(String id, Assignment assignment) {
        Assignment existing = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setId(id);
        assignment.setCreatedAt(existing.getCreatedAt());
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByBatch(String batchId) {
        return assignmentRepository.findByBatchId(batchId);
    }

    public List<Assignment> getAssignmentsByCourse(String courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    // ========== CURRICULUM ==========
    public List<Curriculum> getAllCurriculum() {
        return curriculumRepository.findAll();
    }

    public Optional<Curriculum> getCurriculumById(String id) {
        return curriculumRepository.findById(id);
    }

    public Optional<Curriculum> getActiveCurriculumByCourse(String courseId) {
        return curriculumRepository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public Curriculum createCurriculum(Curriculum curriculum) {
        curriculum.setCreatedAt(new Date());
        curriculum.setUpdatedAt(new Date());
        return curriculumRepository.save(curriculum);
    }

    public Curriculum updateCurriculum(String id, Curriculum curriculum) {
        Curriculum existing = curriculumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curriculum not found"));
        curriculum.setId(id);
        curriculum.setCreatedAt(existing.getCreatedAt());
        curriculum.setUpdatedAt(new Date());
        return curriculumRepository.save(curriculum);
    }

    // ========== ANNOUNCEMENTS ==========
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(String id) {
        return announcementRepository.findById(id);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        announcement.setCreatedAt(new Date());
        announcement.setViewCount(0);
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(String id, Announcement announcement) {
        Announcement existing = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcement.setId(id);
        announcement.setCreatedAt(existing.getCreatedAt());
        return announcementRepository.save(announcement);
    }

    public List<Announcement> getPinnedAnnouncements() {
        return announcementRepository.findByIsPinnedTrue();
    }

    public List<Announcement> getAnnouncementsByType(String type) {
        return announcementRepository.findByType(type);
    }
}
