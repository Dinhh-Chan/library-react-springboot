package com.example.library_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_management.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Tìm danh mục theo tên
    Optional<Category> findByCategoryName(String categoryName);
}
