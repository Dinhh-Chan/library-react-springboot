package com.example.library_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.library_management.dto.CategoryRequest;
import com.example.library_management.entity.Category;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    // Lấy tất cả danh mục
    @GetMapping
    public List<Category> getAllCategories(){
        return categoryService.getAllCategories();
    }

    // Lấy danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id){
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo danh mục mới
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest categoryRequest){
        Category category = (Category) categoryRequest.toCategory();
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.status(201).body(createdCategory);
    }

    // Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest){
        try {
            Category categoryDetails = (Category) categoryRequest.toCategory();
            Category updatedCategory = categoryService.updateCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (ResourceNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex){
            return ResponseEntity.notFound().build();
        }
    }
}
