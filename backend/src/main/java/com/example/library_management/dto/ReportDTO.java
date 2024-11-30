package com.example.library_management.dto;

import java.time.LocalDateTime;

public class ReportDTO {

    private Long reportId;
    private String senderName;
    private String receiverName;
    private String content;
    private LocalDateTime createdAt;
    private String status;
    private Long parentReportId;
    private String title; // Thêm trường title vào DTO

    // Constructors
    public ReportDTO(Long reportId, String senderName, String receiverName, String content, LocalDateTime createdAt, String status, Long parentReportId, String title) {
        this.reportId = reportId;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.content = content;
        this.createdAt = createdAt;
        this.status = status;
        this.parentReportId = parentReportId;
        this.title = title;
    }

    // Getters and Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
