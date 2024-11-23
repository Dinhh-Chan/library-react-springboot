package com.example.library_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_management.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Tìm sách theo tiêu đề chứa một chuỗi (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);
    
    // Tìm sách theo số lượng lớn hơn hoặc bằng
    List<Book> findByQuantityGreaterThanEqual(Integer quantity);
    
    List<Book> findByCategories_Id(Long categoryId);
}
