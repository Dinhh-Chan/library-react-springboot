package com.example.library_management.controller;

import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.Report;
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

    // Lấy tất cả báo cáo
    @GetMapping
    public List<ReportDTO> getAllReports() {
        return reportRepository.findAll().stream()
                .map(ReportDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Lấy báo cáo theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ReportDTO> getReportById(@PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
        return ResponseEntity.ok(ReportDTO.fromEntity(report));
    }

    // Tạo báo cáo mới
    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody ReportDTO reportDTO) {
        // Kiểm tra xem người đọc có tồn tại không
        var reader = readerRepository.findById(reportDTO.getReaderId())
                .orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + reportDTO.getReaderId()));

        Report report = new Report(reader, reportDTO.getContent());
        report = reportRepository.save(report);
        return ResponseEntity.status(201).body(ReportDTO.fromEntity(report));
    }

    // Cập nhật báo cáo
    @PutMapping("/{id}")
    public ResponseEntity<ReportDTO> updateReport(@PathVariable Long id, @RequestBody ReportDTO reportDTO) {
        // Kiểm tra báo cáo đã tồn tại chưa
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));

        // Cập nhật thông tin báo cáo
        report.setContent(reportDTO.getContent());

        // Cập nhật báo cáo trong DB
        report = reportRepository.save(report);
        return ResponseEntity.ok(ReportDTO.fromEntity(report));
    }

    // Xóa báo cáo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
        
        reportRepository.delete(report);
        return ResponseEntity.noContent().build();
    }
}
