package com.example.library_management.dto;

import java.time.LocalDate;

import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;

public class BorrowingResponse {
    private Long id;
    private Long readerId;
    private Long bookId;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private LocalDate actualReturnDate;
    private BorrowingStatus status;

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
        response.setBookId(borrowing.getBook().getId());
        response.setBorrowDate(borrowing.getBorrowDate());
        response.setReturnDate(borrowing.getReturnDate());
        response.setActualReturnDate(borrowing.getActualReturnDate());
        response.setStatus(borrowing.getStatus());
        return response;
    }
}
