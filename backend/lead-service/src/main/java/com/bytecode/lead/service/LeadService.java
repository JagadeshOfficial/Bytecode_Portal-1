package com.bytecode.lead.service;

import com.bytecode.lead.model.Lead;
import com.bytecode.lead.repository.LeadRepository;
import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Optional<Lead> getLeadById(String id) {
        return leadRepository.findById(id);
    }

    public Lead saveLead(Lead lead) {
        return leadRepository.save(lead);
    }

    public void deleteLead(String id) {
        leadRepository.deleteById(id);
    }

    public List<Lead> importCSV(MultipartFile file) throws Exception {
        List<Lead> leads = new ArrayList<>();
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVReader csvReader = new CSVReader(reader);
            String[] line;
            csvReader.readNext(); // Skip header: name,email,phone,course,source
            
            while ((line = csvReader.readNext()) != null) {
                if (line.length < 5) continue;
                
                String name = line[0];
                String email = line[1];
                String phone = line[2];
                String course = line[3];
                String source = line[4];
                
                // Simple validation
                if (isValidEmail(email) && isValidPhone(phone)) {
                    Lead lead = new Lead();
                    lead.setName(name);
                    lead.setEmail(email);
                    lead.setPhone(phone);
                    lead.setCourse(course);
                    lead.setSource(source);
                    leads.add(lead);
                }
            }
        }
        return leadRepository.saveAll(leads);
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return Pattern.compile(emailRegex).matcher(email).matches();
    }

    private boolean isValidPhone(String phone) {
        return phone != null && phone.matches("\\d{10,12}");
    }
}
