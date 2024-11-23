package com.example.library_management.service;

import com.example.library_management.dto.BookInventoryRequest;
import com.example.library_management.dto.InventoryUpdateRequest;
import com.example.library_management.entity.Author;
import com.example.library_management.entity.Book;
import com.example.library_management.entity.Category;
import com.example.library_management.entity.Inventory;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.InventoryRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.library_management.repository.AuthorRepository;
import com.example.library_management.repository.BookRepository;
import com.example.library_management.repository.CategoryRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class InventoryService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final InventoryRepository inventoryRepository;

    public InventoryService(BookRepository bookRepository, CategoryRepository categoryRepository, AuthorRepository authorRepository, InventoryRepository inventoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.inventoryRepository = inventoryRepository;
    }
    @Transactional
    public Inventory updateOrCreateBookInventory(BookInventoryRequest request) {
        final Book finalBook;
        if (request.getBookId() != null) {
            finalBook = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id " + request.getBookId()));
            // Cập nhật thông tin sách nếu cần
            finalBook.setTitle(request.getTitle());
            finalBook.setDescription(request.getDescription());
            finalBook.setPublishedYear(request.getPublishedYear());
            finalBook.setFile(request.getLinkFile());
    
            // Cập nhật mối quan hệ Category
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category not found with id " + categoryId));
                categories.add(category);
            }
            finalBook.setCategories(categories);
    
            // Cập nhật mối quan hệ Author
            Set<Author> authors = new HashSet<>();
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found with id " + authorId));
                authors.add(author);
            }
            finalBook.setAuthors(authors);
    
        } else {
            // Tạo sách mới
            Book newBook = new Book();
            newBook.setTitle(request.getTitle());
            newBook.setDescription(request.getDescription());
            newBook.setPublishedYear(request.getPublishedYear());
            newBook.setFile(request.getLinkFile());
    
            // Thiết lập mối quan hệ Category
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category not found with id " + categoryId));
                categories.add(category);
            }
            newBook.setCategories(categories);
    
            // Thiết lập mối quan hệ Author
            Set<Author> authors = new HashSet<>();
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found with id " + authorId));
                authors.add(author);
            }
            newBook.setAuthors(authors);
    
            finalBook = bookRepository.save(newBook); // Lưu sách mới để có ID
        }
    
        // Sử dụng finalBook trong lambda
        Inventory inventory = inventoryRepository.findByBookId(finalBook.getId())
                .orElseGet(() -> {
                    // Nếu Inventory chưa tồn tại, tạo mới
                    Inventory newInventory = new Inventory();
                    newInventory.setBook(finalBook);
                    return newInventory;
                });
    
        // Cập nhật thông tin Inventory
        inventory.setTotalStock(request.getTotalStock());
        inventory.setAvailableStock(request.getAvailableStock());
    
        // Lưu Inventory
        return inventoryRepository.save(inventory);
    }
    

    // Lấy tất cả Inventory
    public List<Inventory> getAllInventories(){
        return inventoryRepository.findAll();
    }
    // Thêm phương thức saveInventory
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // Lấy Inventory theo ID
    public Optional<Inventory> getInventoryById(Long id){
        return inventoryRepository.findById(id);
    }

    // Tạo Inventory mới
    public Inventory createInventory(Inventory inventory){
        return inventoryRepository.save(inventory);
    }

    // Cập nhật Inventory
    public Inventory updateInventory(InventoryUpdateRequest request) {
        // Tìm Book dựa trên bookId
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with id " + request.getBookId()));

        // Tìm Inventory dựa trên bookId
        Inventory inventory = inventoryRepository.findByBookId(request.getBookId())
                .orElseGet(() -> {
                    // Nếu Inventory chưa tồn tại, tạo mới
                    Inventory newInventory = new Inventory();
                    newInventory.setBook(book);
                    return newInventory;
                });

        // Cập nhật thông tin Inventory
        inventory.setTotalStock(request.getTotalStock());
        inventory.setAvailableStock(request.getAvailableStock());

        // Lưu Inventory
        return inventoryRepository.save(inventory);
    }
    // Xóa Inventory
    public void deleteInventory(Long id){
        inventoryRepository.deleteById(id);
    }

    // Lấy Inventory theo Book
    public Inventory getInventoryByBook(Book book) {
        return inventoryRepository.findByBook(book)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for book id " + book.getId()));
    }

    // Thêm các phương thức nghiệp vụ khác nếu cần
}
