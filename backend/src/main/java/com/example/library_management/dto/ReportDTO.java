package com.example.library_management.dto;

import com.example.library_management.entity.Report;
import java.time.LocalDateTime;

public class ReportDTO {
    private Long reportId;
    private Long senderId;      
    private Long receiverId;    
    private String content;
    private String status;
    private LocalDateTime createdAt;

    // Constructors
    public ReportDTO() {}

    public ReportDTO(Long senderId, Long receiverId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
    }

    // Getters and Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Phương thức chuyển đổi từ Entity sang DTO
    public static ReportDTO fromEntity(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setReportId(report.getReportId());
        dto.setSenderId(report.getSender().getId());
        dto.setReceiverId(report.getReceiver().getId());
        dto.setContent(report.getContent());
        dto.setStatus(report.getStatus().name());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }

    // Phương thức chuyển đổi từ DTO sang Entity
    public Report toEntity() {
        Report report = new Report();
        report.setReportId(this.reportId);
        return report;
    }
}