package com.example.library_management.dto;

import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;

public class BorrowingRequest {
    private Long readerId;
    private Long bookId;

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

    // Phương thức chuyển đổi DTO thành Entity
    public Borrowing toBorrowing() {
        Borrowing borrowing = new Borrowing();
        // borrowDate và returnDate sẽ được thiết lập khi admin duyệt
        borrowing.setStatus(BorrowingStatus.DANG_CHO_DUYET);
        return borrowing;
    }
}
