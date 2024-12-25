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

import java.time.Year;
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
            // Tìm và cập nhật sách nếu đã tồn tại
            finalBook = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id " + request.getBookId()));
            finalBook.setTitle(request.getTitle());
            finalBook.setDescription(request.getDescription());
            finalBook.setPublishedYear(request.getPublishedYear());
            finalBook.setFile(request.getLinkFile());

            // Cập nhật mối quan hệ Category
            Set<Category> categories = new HashSet<>();
            if (request.getCategoryNames() != null && !request.getCategoryNames().isEmpty()) {
                for (String categoryName : request.getCategoryNames()) {
                    Category category = categoryRepository.findByCategoryName(categoryName)
                            .orElseGet(() -> {
                                // Tạo mới nếu không tìm thấy thể loại
                                Category newCategory = new Category();
                                newCategory.setCategoryName(categoryName);
                                return categoryRepository.save(newCategory);
                            });
                    categories.add(category);
                }
            }
            finalBook.setCategories(categories);

            // Cập nhật mối quan hệ Author
            Set<Author> authors = new HashSet<>();
            if (request.getAuthorNames() != null && !request.getAuthorNames().isEmpty()) {
                for (String authorName : request.getAuthorNames()) {
                    Author author = authorRepository.findByName(authorName)
                            .orElseGet(() -> {
                                // Tạo mới nếu không tìm thấy tác giả
                                Author newAuthor = new Author();
                                newAuthor.setName(authorName);
                                return authorRepository.save(newAuthor);
                            });
                    authors.add(author);
                }
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
            if (request.getCategoryNames() != null && !request.getCategoryNames().isEmpty()) {
                for (String categoryName : request.getCategoryNames()) {
                    Category category = categoryRepository.findByCategoryName(categoryName)
                            .orElseGet(() -> {
                                // Tạo mới nếu không tìm thấy thể loại
                                Category newCategory = new Category();
                                newCategory.setCategoryName(categoryName);
                                return categoryRepository.save(newCategory);
                            });
                    categories.add(category);
                }
            }
            newBook.setCategories(categories);

            // Thiết lập mối quan hệ Author
            Set<Author> authors = new HashSet<>();
            if (request.getAuthorNames() != null && !request.getAuthorNames().isEmpty()) {
                for (String authorName : request.getAuthorNames()) {
                    Author author = authorRepository.findByName(authorName)
                            .orElseGet(() -> {
                                // Tạo mới nếu không tìm thấy tác giả
                                Author newAuthor = new Author();
                                newAuthor.setName(authorName);
                                return authorRepository.save(newAuthor);
                            });
                    authors.add(author);
                }
            }
            newBook.setAuthors(authors);

            finalBook = bookRepository.save(newBook); // Lưu sách mới để có ID
        }

        // Tạo hoặc cập nhật Inventory
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
    @Transactional
    public Optional<Inventory> getInventoryByBookId(Long bookId){
        return inventoryRepository.findByBookId(bookId);
    }
}
