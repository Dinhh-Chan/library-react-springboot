package com.example.library_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.library_management.dto.BookBorrowingInfo;
import com.example.library_management.dto.BookInventoryInfo;
import com.example.library_management.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Tìm sách theo tiêu đề chứa một chuỗi (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    
    List<Book> findByCategories_Id(Long categoryId);
    @Query("SELECT new com.example.library_management.dto.BookInventoryInfo(" +
    "b.id, b.title, b.description, b.published_year, b.link_file, " +
    "i.totalStock, i.availableStock, COUNT(br.id)) " +
    "FROM Book b " +
    "LEFT JOIN b.inventory i " +
    "LEFT JOIN b.borrowings br WITH (br.status = 'DANG_MUON' OR br.status = 'QUA_HAN') " +
    "GROUP BY b.id, b.title, b.description, b.published_year, b.link_file, " +
    "i.totalStock, i.availableStock")
List<BookInventoryInfo> findAllBooksWithInventoryAndBorrowingCount();
}
