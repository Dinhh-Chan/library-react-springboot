package com.example.library_management.controller;
import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.*;
import com.example.library_management.service.*;
import com.example.library_management.exception.ResourceNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final ReaderService readerService;  // Khai báo readerService

    // Inject ReportService và ReaderService vào constructor
    public ReportController(ReportService reportService, ReaderService readerService) {
        this.reportService = reportService;
        this.readerService = readerService;  // Inject readerService
    }

    // Lấy tất cả báo cáo
    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    // Lấy báo cáo theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        Optional<Report> report = reportService.getReportById(id);
        return report.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Tạo báo cáo mới
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody ReportDTO reportDTO) {
        // Retrieve sender and receiver from their IDs
        Reader sender = readerService.getReaderById(reportDTO.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with id " + reportDTO.getSenderId()));
        Reader receiver = readerService.getReaderById(reportDTO.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with id " + reportDTO.getReceiverId()));

        // Convert ReportDTO to Report entity
        Report report = reportDTO.toReport(sender, receiver);

        // Save the report
        Report createdReport = reportService.createReport(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
    }

    // Trả lời một báo cáo (tạo báo cáo con)
    @PostMapping("/{reportId}/reply")
    public ResponseEntity<Report> replyToReport(@PathVariable Long reportId, @RequestBody Report replyReport) {
        try {
            Optional<Report> parentReportOpt = reportService.getReportById(reportId);
            if (!parentReportOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Report parentReport = parentReportOpt.get();
            replyReport.setParentReportId(parentReport.getReportId());  // Liên kết với báo cáo gốc
            Report createdReply = reportService.createReport(replyReport);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Cập nhật trạng thái báo cáo (đánh dấu là đã đọc hay chưa đọc)
    @PutMapping("/{id}/status")
    public ResponseEntity<Report> updateReportStatus(@PathVariable Long id, @RequestBody Report.ReportStatus status) {
        try {
            Optional<Report> reportOpt = reportService.getReportById(id);
            if (!reportOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Report report = reportOpt.get();
            report.setStatus(status);
            Report updatedReport = reportService.updateReport(report);
            return ResponseEntity.ok(updatedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Xóa báo cáo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        try {
            Optional<Report> reportOpt = reportService.getReportById(id);
            if (!reportOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            reportService.deleteReport(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
