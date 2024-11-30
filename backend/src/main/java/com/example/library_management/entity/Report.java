package com.example.library_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonBackReference("sender-reports")
    private Reader sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @JsonBackReference("receiver-reports")
    private Reader receiver;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status;

    @Column(name = "parent_report_id")
    private Long parentReportId;  // To allow replies to the original report

    public enum ReportStatus {
        UNREAD, READ
    }

    // Constructors
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
    }

    public Report(Reader sender, Reader receiver, String content, Long parentReportId) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
        this.parentReportId = parentReportId;  // Set the parent report ID if this is a reply
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
}
