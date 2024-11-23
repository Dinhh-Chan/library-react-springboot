package com.example.library_management.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.library_management.dto.BookBorrowingInfo;
import com.example.library_management.dto.BookInventoryInfo;
import com.example.library_management.entity.Book;
import com.example.library_management.entity.Category;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.BookRepository;
import com.example.library_management.repository.CategoryRepository;

@Service
public class BookService {
    
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    // Lấy tất cả sách
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Lấy sách theo ID
    public Optional<Book> getBookById(Long id){
        return bookRepository.findById(id);
    }

    public Optional<Book> getFileById(Long id){
        return bookRepository.findById(id);
    }

    // Tạo sách mới
    @Transactional
    public Book saveBook(Book book, Set<Long> categoryIds){
        Set<Category> categories = categoryRepository.findAllById(categoryIds)
                                        .stream().collect(Collectors.toSet());
        book.setCategories(categories);
        return bookRepository.save(book);
    }

    // Cập nhật sách
    @Transactional
    public Book updateBook(Long id, Book bookDetails, Set<Long> categoryIds){
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            // book.setQuantity(bookDetails.getQuantity());
            Set<Category> categories = categoryRepository.findAllById(categoryIds)
                                            .stream().collect(Collectors.toSet());
            book.setCategories(categories);
            book.setAuthors(bookDetails.getAuthors());
            // Cập nhật các thuộc tính khác nếu cần
            return bookRepository.save(book);
        }).orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    // Xóa sách
    public void deleteBook(Long id){
        bookRepository.deleteById(id);
    }

    public List<Book> getBooksByCategoryId(Long categoryId) {
        return bookRepository.findByCategories_Id(categoryId);
    }
    public List<BookInventoryInfo> getAllBooksWithInventoryAndBorrowingCount() {
        return bookRepository.findAllBooksWithInventoryAndBorrowingCount();
    }

    // Thêm các phương thức nghiệp vụ khác nếu cần
}
