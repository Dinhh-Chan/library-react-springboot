package com.example.library_management.controller;

import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.Report;
import com.example.library_management.entity.Reader;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.ReportRepository;
import com.example.library_management.repository.ReaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReaderRepository readerRepository;

    @GetMapping
    public List<ReportDTO> getAllReports() {
        return reportRepository.findAll().stream()
                .map(ReportDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDTO> getReportById(@PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
        return ResponseEntity.ok(ReportDTO.fromEntity(report));
    }

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody ReportDTO reportDTO) {
        Reader sender = readerRepository.findById(reportDTO.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with id " + reportDTO.getSenderId()));
        
        Reader receiver = readerRepository.findById(reportDTO.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with id " + reportDTO.getReceiverId()));

        Report report = new Report(sender, receiver, reportDTO.getContent());
        report = reportRepository.save(report);
        return ResponseEntity.status(201).body(ReportDTO.fromEntity(report));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportDTO> updateReport(@PathVariable Long id, @RequestBody ReportDTO reportDTO) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));

        report.setContent(reportDTO.getContent());
        report = reportRepository.save(report);
        return ResponseEntity.ok(ReportDTO.fromEntity(report));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
        
        reportRepository.delete(report);
        return ResponseEntity.noContent().build();
    }
}