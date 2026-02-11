package com.bytecode.academic.service;

import com.bytecode.academic.model.Attendance;
import com.bytecode.academic.model.LiveSession;
import com.bytecode.academic.model.Notice;
import com.bytecode.academic.repository.AttendanceRepository;
import com.bytecode.academic.repository.LiveSessionRepository;
import com.bytecode.academic.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;
    private final LiveSessionRepository liveSessionRepository;

    // Attendance
    public List<Attendance> getAttendanceByStudent(String email) {
        // Simple mock: In production add findByStudentEmail in repo
        return attendanceRepository.findAll();
    }

    public Attendance markAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // Notices
    public List<Notice> getAllActiveNotices() {
        return noticeRepository.findAll();
    }

    public Notice postNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    // Sessions
    public List<LiveSession> getLiveSessions() {
        return liveSessionRepository.findAll();
    }

    public LiveSession scheduleSession(LiveSession session) {
        return liveSessionRepository.save(session);
    }
}
