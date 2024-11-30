package com.example.library_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    // Enum for Report Status (e.g., UNREAD or READ)
    public enum ReportStatus {
        UNREAD,
        READ
    }

    // Fields for the Report entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    // Many-to-one relationship with Reader (Sender)
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonBackReference("sender-reports")  // Prevent infinite recursion in JSON serialization
    private Reader sender;

    // Many-to-one relationship with Reader (Receiver)
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @JsonBackReference("receiver-reports")  // Prevent infinite recursion in JSON serialization
    private Reader receiver;

    // Content of the report
    @Column(name = "content", nullable = false)
    private String content;

    // Creation timestamp for the report
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Status of the report (UNREAD or READ)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status;

    // If this report is a reply to another report, this holds the parent report ID
    @Column(name = "parent_report_id")
    private Long parentReportId;

    // Title of the report
    @Column(name = "title", nullable = false)
    private String title;

    // Getters and setters for the fields

    // Constructor without parameters
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
    }

    // Constructor with parameters (to create a new report)
    public Report(Reader sender, Reader receiver, String content, String title, Long parentReportId) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.title = title;
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
        this.parentReportId = parentReportId;
    }

    // Getters and Setters

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Reader getSender() {
        return sender;
    }

    public void setSender(Reader sender) {
        this.sender = sender;
    }

    public Reader getReceiver() {
        return receiver;
    }

    public void setReceiver(Reader receiver) {
        this.receiver = receiver;
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

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
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

    // Methods to get sender and receiver IDs directly
    @JsonProperty("senderId")
    public Long getSenderId() {
        return sender != null ? sender.getId() : null;
    }

    @JsonProperty("receiverId")
    public Long getReceiverId() {
        return receiver != null ? receiver.getId() : null;
    }
}
