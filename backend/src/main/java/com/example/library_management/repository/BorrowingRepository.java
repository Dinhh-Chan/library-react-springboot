package com.example.library_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    // Tìm tất cả các lần mượn theo ID của người đọc
    List<Borrowing> findByReaderId(Long readerId);
    
    // Tìm tất cả các lần mượn theo ID của sách
    List<Borrowing> findByBookId(Long bookId);
    
    // Tìm tất cả các lần mượn theo trạng thái
    List<Borrowing> findByStatus(com.example.library_management.enums.BorrowingStatus status);
    // Thêm các phương thức tùy chỉnh nếu cần
    List<Borrowing> findByBorrowDateBetween(LocalDate startDate, LocalDate endDate);

}
