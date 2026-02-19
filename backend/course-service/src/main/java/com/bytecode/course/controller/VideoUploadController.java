package com.bytecode.course.controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class VideoUploadController {

    private final GridFsTemplate gridFsTemplate;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Video upload service is active");
    }

    @PostMapping("/videos")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Starting cloud upload for file: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize() + " bytes");

            ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(),
                    file.getContentType());

            System.out.println("Upload successful! GridFS FileID: " + fileId.toString());
            return ResponseEntity.ok(fileId.toString());
        } catch (IOException e) {
            System.err.println("Upload failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload video: " + e.getMessage());
        }
    }

    @GetMapping("/videos/{id}")
    public void getVideo(@PathVariable String id, HttpServletResponse response) throws IOException {
        System.out.println("Streaming video with ID: " + id);
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
        if (file != null) {
            GridFsResource resource = gridFsTemplate.getResource(file);

            // Set content type if possible
            if (file.getMetadata() != null && file.getMetadata().containsKey("_contentType")) {
                response.setContentType(file.getMetadata().getString("_contentType"));
            } else {
                response.setContentType("video/webm");
            }

            FileCopyUtils.copy(resource.getInputStream(), response.getOutputStream());
            System.out.println("Streaming completed for ID: " + id);
        } else {
            System.err.println("Video not found: " + id);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

}
