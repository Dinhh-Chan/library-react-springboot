package com.example.library_management.service;

import com.example.library_management.entity.Author;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {
    
    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository){
        this.authorRepository = authorRepository;
    }

    // Lấy tất cả tác giả
    public List<Author> getAllAuthors(){
        return authorRepository.findAll();
    }

    // Lấy tác giả theo ID
    public Optional<Author> getAuthorById(Long id){
        return authorRepository.findById(id);
    }

    // Tạo tác giả mới
    public Author createAuthor(Author author){
        return authorRepository.save(author);
    }

    // Cập nhật tác giả
    public Author updateAuthor(Long id, Author authorDetails){
        return authorRepository.findById(id).map(author -> {
            author.setName(authorDetails.getName());
            author.setBio(authorDetails.getBio());
            // Cập nhật các thuộc tính khác nếu cần
            return authorRepository.save(author);
        }).orElseThrow(() -> new ResourceNotFoundException("Author not found with id " + id));
    }

    // Xóa tác giả
    public void deleteAuthor(Long id){
        authorRepository.deleteById(id);
    }

    // Thêm các phương thức nghiệp vụ khác nếu cần
}
