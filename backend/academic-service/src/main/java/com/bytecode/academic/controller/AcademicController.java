package com.bytecode.academic.controller;

import com.bytecode.academic.model.Attendance;
import com.bytecode.academic.model.LiveSession;
import com.bytecode.academic.model.Notice;
import com.bytecode.academic.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    @GetMapping("/notices")
    public List<Notice> getNotices() {
        return academicService.getAllActiveNotices();
    }

    @PostMapping("/notices")
    public Notice postNotice(@RequestBody Notice notice) {
        return academicService.postNotice(notice);
    }

    @GetMapping("/sessions")
    public List<LiveSession> getSessions() {
        return academicService.getLiveSessions();
    }

    @PostMapping("/attendance")
    public Attendance markAttendance(@RequestBody Attendance attendance) {
        return academicService.markAttendance(attendance);
    }
}
