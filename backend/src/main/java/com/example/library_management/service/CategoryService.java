package com.example.library_management.service;

import com.example.library_management.entity.Category;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    // Lấy tất cả danh mục
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    // Lấy danh mục theo ID
    public Optional<Category> getCategoryById(Long id){
        return categoryRepository.findById(id);
    }

    // Tạo danh mục mới
    public Category createCategory(Category category){
        return categoryRepository.save(category);
    }

    // Cập nhật danh mục
    public Category updateCategory(Long id, Category categoryDetails){
        return categoryRepository.findById(id).map(category -> {
            category.setCategoryName(categoryDetails.getCategoryName());
            // Cập nhật các thuộc tính khác nếu cần
            return categoryRepository.save(category);
        }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    // Xóa danh mục
    public void deleteCategory(Long id){
        categoryRepository.deleteById(id);
    }

    // Thêm các phương thức nghiệp vụ khác nếu cần
}
