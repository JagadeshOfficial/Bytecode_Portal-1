package com.bytecode.placement.service;

import com.bytecode.placement.model.JobListing;
import com.bytecode.placement.model.PlacementRecord;
import com.bytecode.placement.repository.JobRepository;
import com.bytecode.placement.repository.PlacementRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlacementService {

    private final JobRepository jobRepository;
    private final PlacementRecordRepository placementRecordRepository;

    public List<JobListing> getAllJobs() {
        return jobRepository.findAll();
    }

    public JobListing postJob(JobListing job) {
        return jobRepository.save(job);
    }

    public List<PlacementRecord> getAllPlacements() {
        return placementRecordRepository.findAll();
    }

    public PlacementRecord addPlacement(PlacementRecord record) {
        return placementRecordRepository.save(record);
    }
}
