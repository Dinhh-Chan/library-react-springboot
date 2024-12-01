package com.example.library_management.service;

import com.example.library_management.entity.Report;
import com.example.library_management.repository.ReportRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.library_management.entity.Reader;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
    public Page<Report> getReportsByUserId(Long userId, Pageable pageable) {
        // Call the repository's find method with pagination
        return reportRepository.findByReceiverIdOrSenderId(userId, userId, pageable);
    }
    public List<Report> getReportsBySenderOrReceiver(Reader sender, Reader receiver) {
        return reportRepository.findBySenderOrReceiver(sender, receiver);
    }
    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }
}
