package com.example.library_management.dto;

import java.time.LocalDate;

import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;

public class BorrowingResponse {
    private Long id;
    private Long readerId;
    private String username;    
    private Long bookId;
    private String linkFile;   
    private String bookTitle; 
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private LocalDate actualReturnDate;
    private BorrowingStatus status;
    public String getBookTitle() {        // Getter cho bookTitle
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {    // Setter cho bookTitle
        this.bookTitle = bookTitle;
    }
    // Getters và Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReaderId() {
        return readerId;
    }

    public void setReaderId(Long readerId) {
        this.readerId = readerId;
    }

    public String getUsername() {        // Getter cho username
        return username;
    }

    public void setUsername(String username) {    // Setter cho username
        this.username = username;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getLinkFile() {        // Getter cho linkFile
        return linkFile;
    }

    public void setLinkFile(String linkFile) {    // Setter cho linkFile
        this.linkFile = linkFile;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public LocalDate getActualReturnDate() {
        return actualReturnDate;
    }

    public void setActualReturnDate(LocalDate actualReturnDate) {
        this.actualReturnDate = actualReturnDate;
    }

    public BorrowingStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowingStatus status) {
        this.status = status;
    }

    // Phương thức chuyển đổi từ Entity sang DTO
    public static BorrowingResponse fromEntity(Borrowing borrowing) {
        BorrowingResponse response = new BorrowingResponse();
        response.setId(borrowing.getId());
        response.setReaderId(borrowing.getReader().getId());

        // Giả sử Reader có phương thức getUsername()
        response.setUsername(borrowing.getReader().getUsername());

        response.setBookId(borrowing.getBook().getId());
        response.setLinkFile(borrowing.getBook().getFile()); // Sử dụng getter đúng
        response.setBookTitle(borrowing.getBook().getTitle());
        response.setBorrowDate(borrowing.getBorrowDate());
        response.setReturnDate(borrowing.getReturnDate());
        response.setActualReturnDate(borrowing.getActualReturnDate());
        response.setStatus(borrowing.getStatus());
        return response;
    }
}
