package com.example.library_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_management.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    // Tìm Inventory theo ID của sách
    Optional<Inventory> findByBookId(Long bookId);
    
    // Thêm các phương thức tùy chỉnh nếu cần
}
