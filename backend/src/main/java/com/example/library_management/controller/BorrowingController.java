package com.example.library_management.controller;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import com.example.library_management.dto.BorrowingLimitResponse;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.example.library_management.service.EmailService;
@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {
    @Autowired
    private EmailService emailService;
    public class ErrorResponse {
        private String message;
    
        public ErrorResponse(String message) {
            this.message = message;
        }
    
        public String getMessage() {
            return message;
        }
    
        public void setMessage(String message) {
            this.message = message;
        }
    }
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
    public ResponseEntity<?> createBorrowing(@RequestBody BorrowingRequest borrowingRequest) {
        // Lấy Reader và Book từ ID
        Reader reader = readerService.getReaderById(borrowingRequest.getReaderId())
                .orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + borrowingRequest.getReaderId()));
        Book book = bookService.getBookById(borrowingRequest.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + borrowingRequest.getBookId()));
        
        // Kiểm tra số lượng đơn mượn của người dùng
        if (borrowingService.isLimitReached(reader.getId())) {
            // Nếu tổng số đơn mượn, đã trả và quá hạn lớn hơn hoặc bằng 10, trả về lỗi
            ErrorResponse errorResponse = new ErrorResponse("Cannot borrow more books, limit reached.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }
    
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

    // Lấy tất cả borrowings theo readerId
    @GetMapping("/reader/{readerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<BorrowingResponse>> getBorrowingsByReaderId(@PathVariable Long readerId) {
        List<Borrowing> borrowings = borrowingService.getBorrowingsByReaderId(readerId);
        List<BorrowingResponse> responses = borrowings.stream()
                .map(BorrowingResponse::fromEntity)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
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

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BorrowingResponse> approveBorrowing(@PathVariable Long id) {
        Borrowing approvedBorrowing = borrowingService.approveBorrowing(id);
        BorrowingResponse response = BorrowingResponse.fromEntity(approvedBorrowing);
    
        // Lấy thông tin người mượn và sách từ Borrowing
        Reader reader = approvedBorrowing.getReader();
        String email = reader.getEmail();
        String fullName = reader.getHoVaTen();
        String bookTitle = approvedBorrowing.getBook().getTitle();
        String borrowDate = approvedBorrowing.getBorrowDate().toString();
        String returnDate = approvedBorrowing.getReturnDate().toString();
    
        // Nội dung email
        String emailSubject = "Đơn mượn sách đã được duyệt";
        String emailBody = "<h3>Chào " + fullName + ",</h3>"
                         + "<p>Đơn mượn sách của bạn đã được duyệt thành công.</p>"
                         + "<p><strong>Thông tin sách:</strong></p>"
                         + "<p>Tiêu đề: " + bookTitle + "</p>"
                         + "<p>Ngày mượn: " + borrowDate + "</p>"
                         + "<p>Ngày trả dự kiến: " + returnDate + "</p>"
                         + "<p>Chúc bạn đọc sách vui vẻ!</p>";
    
        // Gửi email
        emailService.sendEmail(email, emailSubject, emailBody);
    
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
    @GetMapping("/user/{userId}/limit")
    public ResponseEntity<BorrowingLimitResponse> getBorrowLimit(@PathVariable Long userId) {
        BorrowingLimitResponse borrowLimitResponse = borrowingService.getBorrowLimit(userId);
        return ResponseEntity.ok(borrowLimitResponse);
    }
}
