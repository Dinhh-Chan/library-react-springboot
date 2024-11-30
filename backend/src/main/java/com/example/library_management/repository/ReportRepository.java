package com.example.library_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.library_management.entity.Report;
import java.util.*;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
    List<Report> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}
