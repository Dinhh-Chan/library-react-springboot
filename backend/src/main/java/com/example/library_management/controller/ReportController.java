package com.example.library_management.controller;
import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.*;
import com.example.library_management.service.*;
import com.example.library_management.exception.ResourceNotFoundException;
import java.util.*;

import com.example.library_management.repository.ReaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private final ReportService reportService;
    @Autowired
    private final ReaderService readerService;  // Khai báo readerService
    @Autowired
    private ReaderRepository readerRepository; 
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
    public ResponseEntity<Report> replyToReport(
            @PathVariable Long reportId,   // Get the parent report ID
            @RequestBody ReportDTO reportDTO) {  // Receive the ReportDTO
    
        // Fetch sender and receiver from the repository
        Reader sender = readerRepository.findById(reportDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        Reader receiver = readerRepository.findById(reportDTO.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
    
        // Convert ReportDTO to Report entity
        Report report = reportDTO.toReport(sender, receiver);
    
        // Set parent report if it's a reply
        report.setParentReportId(reportId);
    
        // Save the report
        Report savedReport = reportService.saveReport(report);
    
        // Return the saved report in the response
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
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
    @GetMapping("/{reportId}/parentReports")
        public ResponseEntity<List<Report>> getParentReports(@PathVariable Long reportId) {
        List<Report> parentReports = new ArrayList<>();
        Optional<Report> currentReportOpt = reportService.getReportById(reportId);

        if (!currentReportOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Nếu không tìm thấy báo cáo
        }

        Report currentReport = currentReportOpt.get();

        // Lặp lại cho đến khi không có báo cáo cha nữa
        while (currentReport.getParentReportId() != null) {
            Optional<Report> parentReportOpt = reportService.getReportById(currentReport.getParentReportId());
            if (parentReportOpt.isPresent()) {
                parentReports.add(parentReportOpt.get());
                currentReport = parentReportOpt.get();  // Cập nhật báo cáo hiện tại là báo cáo cha
            } else {
                break;  // Nếu không tìm thấy báo cáo cha, thoát khỏi vòng lặp
            }
        }

        // Nếu không có báo cáo cha nào
        if (parentReports.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        // Trả về danh sách báo cáo cha
        Collections.reverse(parentReports);  // Để hiển thị báo cáo cha gần nhất trước
        return ResponseEntity.ok(parentReports);
    }
    @GetMapping("/{reportId}/replies")
    public ResponseEntity<List<Report>> getRepliesToReport(@PathVariable Long reportId) {
        List<Report> replies = reportService.getRepliesToReport(reportId);
    
        if (replies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Trả về 204 nếu không có báo cáo trả lời
        }
    
        return ResponseEntity.ok(replies);  // Trả về danh sách báo cáo trả lời
    }
}
