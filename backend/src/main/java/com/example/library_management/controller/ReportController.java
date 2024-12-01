package com.example.library_management.controller;
import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.*;
import com.example.library_management.service.*;
import com.example.library_management.exception.ResourceNotFoundException;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
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
    public ResponseEntity<Report> updateReportStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            Optional<Report> reportOpt = reportService.getReportById(id);
            if (!reportOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Report report = reportOpt.get();
            String status = statusRequest.get("status"); // Lấy giá trị "status" từ body JSON
            report.setStatus(Report.ReportStatus.valueOf(status)); // Chuyển đổi thành enum
            Report updatedReport = reportService.updateReport(report);
            return ResponseEntity.ok(updatedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<List<Report>> getReportsByUserIdPaged(@PathVariable Long userId, 
                                                                @RequestParam int page, 
                                                                @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reportPage = reportService.getReportsByUserId(userId, pageable);

        if (reportPage.hasContent()) {
            return ResponseEntity.ok(reportPage.getContent());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<List<Report>> getAllReportsByUserId(
        @PathVariable Long userId, 
        Pageable pageable) {
        
        // Fetch reports by userId with pagination
        Page<Report> reports = reportService.getReportsByUserId(userId, pageable);
        
        // Convert Page<Report> to List<Report>
        List<Report> reportList = reports.getContent();
        
        // Check if there are reports
        if (reportList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    
        // Return paginated reports
        return ResponseEntity.ok(reportList);
    }

}
