package com.example.library_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.library_management.entity.Reader;
import com.example.library_management.entity.Report;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
    List<Report> findByParentReportId(Long parentReportId);
    List<Report> findBySenderOrReceiver(Reader sender, Reader receiver);
    @Query("SELECT r FROM Report r WHERE r.sender.id = :senderId OR r.receiver.id = :receiverId")
    Page<Report> findByReceiverIdOrSenderId(@Param("senderId") Long senderId, 
                                             @Param("receiverId") Long receiverId, 
                                             Pageable pageable);}
