package com.example.library_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "reader_id", nullable = false)
    @JsonBackReference("reader-reports")  // Để tránh vòng lặp trong JSON
    private Reader reader;

    @Column(name = "content", nullable = false)
    private String content;

    // Constructors
    public Report() {}

    public Report(Reader reader, String content) {
        this.reader = reader;
        this.content = content;
    }

    // Getters và Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Reader getReader() {
        return reader;
    }

    public void setReader(Reader reader) {
        this.reader = reader;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
