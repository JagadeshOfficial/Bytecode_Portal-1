package com.bytecode.placement.controller;

import com.bytecode.placement.model.JobListing;
import com.bytecode.placement.model.PlacementRecord;
import com.bytecode.placement.service.PlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placements")
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

    @DeleteMapping("/records/{id}")
    public void deletePlacement(@PathVariable String id) {
        placementService.deletePlacement(id);
    }

    @PutMapping("/records/{id}")
    public PlacementRecord updatePlacement(@PathVariable String id, @RequestBody PlacementRecord record) {
        return placementService.updatePlacement(id, record);
    }
    @DeleteMapping("/jobs/{id}")
    public void deleteJob(@PathVariable String id) {
        placementService.deleteJob(id);
    }

    @PutMapping("/jobs/{id}")
    public JobListing updateJob(@PathVariable String id, @RequestBody JobListing job) {
        return placementService.updateJob(id, job);
    }
}
