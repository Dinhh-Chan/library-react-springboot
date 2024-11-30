package com.example.library_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_report_id")  // Liên kết với báo cáo gốc
    private Report parentReport;  // Dùng đối tượng Report thay vì chỉ lưu id

    @OneToMany(mappedBy = "parentReport")
    private List<Report> replies;  // Danh sách các báo cáo trả lời

    public enum ReportStatus {
        UNREAD, READ
    }

    // Constructors
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
    }

    public Report(Reader sender, Reader receiver, String content, Report parentReport) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.UNREAD;
        this.parentReport = parentReport;  // Liên kết với báo cáo gốc
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

    public Report getParentReport() {
        return parentReport;
    }

    public void setParentReport(Report parentReport) {
        this.parentReport = parentReport;
    }

    public List<Report> getReplies() {
        return replies;
    }

    public void setReplies(List<Report> replies) {
        this.replies = replies;
    }
}
