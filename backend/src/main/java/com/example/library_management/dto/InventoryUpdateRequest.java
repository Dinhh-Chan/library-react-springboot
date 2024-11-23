package com.example.library_management.dto;

public class InventoryUpdateRequest {
    private Long bookId;
    private Integer totalStock;
    private Integer availableStock;

    // Constructors
    public InventoryUpdateRequest() {}

    public InventoryUpdateRequest(Long bookId, Integer totalStock, Integer availableStock) {
        this.bookId = bookId;
        this.totalStock = totalStock;
        this.availableStock = availableStock;
    }

    // Getters và Setters

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Integer getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(Integer totalStock) {
        this.totalStock = totalStock;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }
}
