package com.example.library_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.library_management.dto.BookBorrowingInfo;
import com.example.library_management.dto.BookInventoryInfo;
import com.example.library_management.dto.BookRequest;
import com.example.library_management.entity.Book;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {
    
    private final BookService bookService;

    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    // Lấy tất cả sách
    @GetMapping
    public List<Book> getAllBooks(){
        return bookService.getAllBooks();
    }

    // Lấy sách theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id){
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo sách mới
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody BookRequest bookRequest){
        Book createdBook = bookService.saveBook(bookRequest.toBook(), bookRequest.getCategoryIds());
        return ResponseEntity.status(201).body(createdBook);
    }

    // Cập nhật sách
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequest bookRequest){
        try {
            Book updatedBook = bookService.updateBook(id, bookRequest.toBook(), bookRequest.getCategoryIds());
            return ResponseEntity.ok(updatedBook);
        } catch (ResourceNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa sách
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id){
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex){
            return ResponseEntity.notFound().build();
        }
    }  
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<Book>> getBooksByCategoryId(@PathVariable Long categoryId) {
        List<Book> books = bookService.getBooksByCategoryId(categoryId);
        return ResponseEntity.ok(books);
    }
    @GetMapping("/inventory-info")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<BookInventoryInfo>> getAllBooksWithInventoryAndBorrowingCount() {
        List<BookInventoryInfo> books = bookService.getAllBooksWithInventoryAndBorrowingCount();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

}
