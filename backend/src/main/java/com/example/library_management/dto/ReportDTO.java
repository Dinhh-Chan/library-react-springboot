package com.example.library_management.dto;

import com.example.library_management.entity.Report;
import com.example.library_management.entity.Reader;

import java.time.LocalDateTime;

public class ReportDTO {

    private Long reportId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime createdAt;
    private String status;
    private Long parentReportId;

    // Constructors
    public ReportDTO() {}

    public ReportDTO(Long reportId, Long senderId, Long receiverId, String content, 
                     LocalDateTime createdAt, String status, Long parentReportId) {
        this.reportId = reportId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.createdAt = createdAt;
        this.status = status;
        this.parentReportId = parentReportId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getParentReportId() {
        return parentReportId;
    }

    public void setParentReportId(Long parentReportId) {
        this.parentReportId = parentReportId;
    }

    // Phương thức chuyển đổi từ entity Report sang ReportDTO
    public static ReportDTO fromReport(Report report) {
        return new ReportDTO(
            report.getReportId(),
            report.getSender().getId(),  // Truyền ID của Sender (Reader)
            report.getReceiver().getId(),  // Truyền ID của Receiver (Reader)
            report.getContent(),
            report.getCreatedAt(),
            report.getStatus().name(),  // Trả về trạng thái dạng String
            report.getParentReportId()
        );
    }
}
