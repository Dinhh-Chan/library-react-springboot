package com.example.library_management.service;

import com.example.library_management.entity.Report;
import com.example.library_management.enums.BorrowingStatus;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.ReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.library_management.dto.ReportDTO;
import com.example.library_management.entity.Reader;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReaderService readerService;

    @Autowired
    public ReportService(ReportRepository reportRepository, ReaderService readerService) {
        this.reportRepository = reportRepository;
        this.readerService = readerService;
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
        return reportRepository.findByReceiverIdOrSenderId(userId, userId, pageable);
    }

    public List<Report> getRepliesToReport(Long parentReportId) {
        return reportRepository.findByParentReportId(parentReportId);
    }

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }
}
