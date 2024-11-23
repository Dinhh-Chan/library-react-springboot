package com.example.library_management.dto;

import java.time.Year;

public class BookInventoryRequest {
    private Long bookId; // Nếu null, sẽ tạo sách mới
    private String title;
    private String description;
    private Year publishedYear;
    private String linkFile;
    private Integer totalStock;
    private Integer availableStock;
    private Long[] categoryIds;
    private Long[] authorIds;

    // Constructors
    public BookInventoryRequest() {}

    public BookInventoryRequest(Long bookId, String title, String description, Year publishedYear,
                                String linkFile, Integer totalStock, Integer availableStock,
                                Long[] categoryIds, Long[] authorIds) {
        this.bookId = bookId;
        this.title = title;
        this.description = description;
        this.publishedYear = publishedYear;
        this.linkFile = linkFile;
        this.totalStock = totalStock;
        this.availableStock = availableStock;
        this.categoryIds = categoryIds;
        this.authorIds = authorIds;
    }

    // Getters và Setters

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Year getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Year publishedYear) {
        this.publishedYear = publishedYear;
    }

    public String getLinkFile() {
        return linkFile;
    }

    public void setFile(String linkFile) {
        this.linkFile = linkFile;
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

    public Long[] getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(Long[] categoryIds) {
        this.categoryIds = categoryIds;
    }

    public Long[] getAuthorIds() {
        return authorIds;
    }

    public void setAuthorIds(Long[] authorIds) {
        this.authorIds = authorIds;
    }
}
