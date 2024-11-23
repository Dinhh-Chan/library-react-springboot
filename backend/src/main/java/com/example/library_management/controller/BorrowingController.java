package com.example.library_management.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.library_management.dto.BorrowingRequest;
import com.example.library_management.dto.BorrowingResponse;
import com.example.library_management.entity.Borrowing;
import com.example.library_management.entity.Book;
import com.example.library_management.entity.Reader;
import com.example.library_management.service.BorrowingService;
import com.example.library_management.service.ReaderService;
import com.example.library_management.service.BookService;
import com.example.library_management.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final ReaderService readerService;
    private final BookService bookService;

    public BorrowingController(BorrowingService borrowingService, ReaderService readerService, BookService bookService) {
        this.borrowingService = borrowingService;
        this.readerService = readerService;
        this.bookService = bookService;
    }

    // Tạo một borrowing mới
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<BorrowingResponse> createBorrowing(@RequestBody BorrowingRequest borrowingRequest) {
        // Lấy Reader và Book từ ID
        Reader reader = readerService.getReaderById(borrowingRequest.getReaderId())
                .orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + borrowingRequest.getReaderId()));
        Book book = bookService.getBookById(borrowingRequest.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + borrowingRequest.getBookId()));

        // Tạo Borrowing entity
        Borrowing borrowing = borrowingRequest.toBorrowing();
        borrowing.setReader(reader);
        borrowing.setBook(book);

        // Tạo borrowing
        Borrowing createdBorrowing = borrowingService.createBorrowing(borrowing);
        BorrowingResponse response = BorrowingResponse.fromEntity(createdBorrowing);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Lấy tất cả các borrowings
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<BorrowingResponse>> getAllBorrowings() {
        List<Borrowing> borrowings = borrowingService.getAllBorrowings();
        List<BorrowingResponse> responses = borrowings.stream()
                .map(BorrowingResponse::fromEntity)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    // Lấy một borrowing theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<BorrowingResponse> getBorrowingById(@PathVariable Long id) {
        Borrowing borrowing = borrowingService.getBorrowingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));
        BorrowingResponse response = BorrowingResponse.fromEntity(borrowing);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Cập nhật một borrowing
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<BorrowingResponse> updateBorrowing(@PathVariable Long id, @RequestBody BorrowingRequest borrowingRequest) {
        // Lấy Reader và Book từ ID
        Reader reader = readerService.getReaderById(borrowingRequest.getReaderId())
                .orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + borrowingRequest.getReaderId()));
        Book book = bookService.getBookById(borrowingRequest.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + borrowingRequest.getBookId()));

        // Tạo Borrowing entity từ DTO
        Borrowing borrowingDetails = borrowingRequest.toBorrowing();
        borrowingDetails.setReader(reader);
        borrowingDetails.setBook(book);

        // Cập nhật borrowing
        Borrowing updatedBorrowing = borrowingService.updateBorrowing(id, borrowingDetails);
        BorrowingResponse response = BorrowingResponse.fromEntity(updatedBorrowing);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Xóa một borrowing
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBorrowing(@PathVariable Long id) {
        borrowingService.deleteBorrowing(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Endpoint để admin duyệt đơn mượn
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BorrowingResponse> approveBorrowing(@PathVariable Long id) {
        Borrowing approvedBorrowing = borrowingService.approveBorrowing(id);
        BorrowingResponse response = BorrowingResponse.fromEntity(approvedBorrowing);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Endpoint để trả sách
    @PostMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<BorrowingResponse> returnBorrowing(
            @PathVariable Long id,
            @RequestParam(required = false) String actualReturnDate) {
        LocalDate returnDate = null;
        if (actualReturnDate != null && !actualReturnDate.isEmpty()) {
            try {
                returnDate = LocalDate.parse(actualReturnDate);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date format for actualReturnDate. Expected format: YYYY-MM-DD");
            }
        }
        Borrowing returnedBorrowing = borrowingService.returnBorrowing(id, returnDate);
        BorrowingResponse response = BorrowingResponse.fromEntity(returnedBorrowing);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
