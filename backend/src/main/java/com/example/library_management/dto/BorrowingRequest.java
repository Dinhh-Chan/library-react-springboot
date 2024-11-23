package com.example.library_management.dto;

import java.time.LocalDate;

import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;

public class BorrowingRequest {
    private Long readerId;

    private Long bookId;
    private LocalDate borrowDate;
    private LocalDate returnDate;

    // Getters và Setters

    public Long getReaderId() {
        return readerId;
    }

    public void setReaderId(Long readerId) {
        this.readerId = readerId;
    }

    public Long getBookId() {
        return bookId;
    }

	public void setBookId(Long bookId) {
		this.bookId = bookId;
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

    // Phương thức chuyển đổi DTO thành Entity
    public Borrowing toBorrowing() {
        Borrowing borrowing = new Borrowing();
        borrowing.setBorrowDate(this.borrowDate);
        borrowing.setReturnDate(this.returnDate);
        borrowing.setStatus(BorrowingStatus.DANG_CHO_DUYET);
        return borrowing;
    }
}
