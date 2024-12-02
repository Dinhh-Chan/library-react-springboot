package com.example.library_management.dto;

import com.example.library_management.entity.Report;
import com.example.library_management.entity.Reader;

public class ReportDTO {

    private Long senderId;           // ID của người gửi
    private Long receiverId;         // ID của người nhận
    private String content;          // Nội dung báo cáo
    private String status;           // Trạng thái báo cáo (UNREAD/READ)
    private String title;            // Tiêu đề của báo cáo
    private Long parentReportId;     // ID của báo cáo gốc (nếu là trả lời báo cáo khác)

    // Getters and Setters
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getParentReportId() {
        return parentReportId;
    }

    public void setParentReportId(Long parentReportId) {
        this.parentReportId = parentReportId;
    }

    public Report toReport(Reader sender, Reader receiver) {
        Report report = new Report();
        report.setSender(sender);
        report.setReceiver(receiver);
        report.setContent(this.content);
        report.setTitle(this.title);
    
        try {
            // Convert string status to enum, add a check to ensure the status is valid
            report.setStatus(Report.ReportStatus.valueOf(this.status));
        } catch (IllegalArgumentException e) {
            // Handle invalid status, you could set a default value or throw an exception
            throw new IllegalArgumentException("Invalid status value: " + this.status);
        }
    
        report.setParentReportId(this.parentReportId);
        return report;
    }
}
