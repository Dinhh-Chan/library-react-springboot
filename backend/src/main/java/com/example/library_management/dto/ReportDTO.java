package com.example.library_management.dto;

import com.example.library_management.entity.Report;

public class ReportDTO {

    private Long reportId;
    private Long readerId;  // Tham chiếu đến ID của độc giả
    private String content;

    // Getters và Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getReaderId() {
        return readerId;
    }

    public void setReaderId(Long readerId) {
        this.readerId = readerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // Phương thức chuyển đổi từ Entity sang DTO
    public static ReportDTO fromEntity(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setReportId(report.getReportId());
        dto.setReaderId(report.getReader().getId());
        dto.setContent(report.getContent());
        return dto;
    }
}
