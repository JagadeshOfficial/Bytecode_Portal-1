package com.bytecode.placement.controller;

import com.bytecode.placement.model.JobListing;
import com.bytecode.placement.model.PlacementRecord;
import com.bytecode.placement.service.PlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;

    @GetMapping("/jobs")
    public List<JobListing> getJobs() {
        return placementService.getAllJobs();
    }

    @PostMapping("/jobs")
    public JobListing postJob(@RequestBody JobListing job) {
        return placementService.postJob(job);
    }

    @GetMapping("/records")
    public List<PlacementRecord> getPlacements() {
        return placementService.getAllPlacements();
    }

    @PostMapping("/records")
    public PlacementRecord addPlacement(@RequestBody PlacementRecord record) {
        return placementService.addPlacement(record);
    }
}
