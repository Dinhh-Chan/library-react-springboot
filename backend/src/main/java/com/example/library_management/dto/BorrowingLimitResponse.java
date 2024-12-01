package com.example.library_management.dto;
public class BorrowingLimitResponse {
    private long count;

    public BorrowingLimitResponse(long count) {
        this.count = count;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}