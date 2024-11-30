package com.example.library_management.dto;
import com.example.library_management.entity.*;
import java.time.LocalDateTime;

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

    // Method to convert ReportDTO to Report entity
    public Report toReport(Reader sender, Reader receiver) {
        Report report = new Report();
        report.setSender(sender);
        report.setReceiver(receiver);
        report.setContent(this.content);
        report.setTitle(this.title);
        report.setStatus(Report.ReportStatus.valueOf(this.status));  // Assuming status is sent as a string
        report.setParentReportId(this.parentReportId);  // If it's a reply, set the parent report ID
        return report;
    }
}
