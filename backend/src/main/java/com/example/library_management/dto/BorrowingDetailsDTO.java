package com.example.library_management.dto;

import java.time.LocalDate;

public class BorrowingDetailsDTO {
    private Long id;
    private Long idReader;        // ID người đọc
    private String bookTitle;     // Tên sách
    private String bookImageUrl;  // Link ảnh sách
    private String readerName;    // Tên người đọc
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private String status;

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdReader() {
        return idReader;
    }

    public void setIdReader(Long idReader) {
        this.idReader = idReader;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getBookImageUrl() {
        return bookImageUrl;
    }

    public void setBookImageUrl(String bookImageUrl) {
        this.bookImageUrl = bookImageUrl;
    }

    public String getReaderName() {
        return readerName;
    }

    public void setReaderName(String readerName) {
        this.readerName = readerName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
