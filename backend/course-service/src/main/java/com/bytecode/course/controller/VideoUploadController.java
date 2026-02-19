package com.bytecode.course.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;

import java.io.IOException;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class VideoUploadController {

    private final GridFsTemplate gridFsTemplate;

    @PostMapping("/video")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(),
                    file.getContentType());
            return ResponseEntity.ok(fileId.toString());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload video: " + e.getMessage());
        }
    }
}
