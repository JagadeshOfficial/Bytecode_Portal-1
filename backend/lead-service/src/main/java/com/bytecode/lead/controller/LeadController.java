package com.bytecode.lead.controller;

import com.bytecode.lead.model.Lead;
import com.bytecode.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadService.getAllLeads();
    }

    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        return leadService.saveLead(lead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable String id, @RequestBody Lead lead) {
        return leadService.getLeadById(id)
                .map(existingLead -> {
                    lead.setId(id);
                    return ResponseEntity.ok(leadService.saveLead(lead));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable String id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<List<Lead>> importLeads(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(leadService.importCSV(file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
