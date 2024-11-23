package com.example.library_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_management.entity.Reader;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Long> {
    // Tìm người đọc theo tên đăng nhập
    Optional<Reader> findByUsername(String username);
    
    // Tìm người đọc theo email hoặc thông tin liên hệ khác (nếu có)
    // Optional<Reader> findByEmail(String email);
    
    // Thêm các phương thức tùy chỉnh nếu cần
}
