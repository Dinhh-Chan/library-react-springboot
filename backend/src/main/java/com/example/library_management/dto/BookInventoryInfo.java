package com.example.library_management.dto;

import java.time.Year;

public class BookInventoryInfo {
    private Long id;
    private String title;
    private String description;
    private Year publishedYear;
    private String linkFile;
    private Integer totalStock;
    private Integer availableStock;
    private Long borrowingCount;

    // Constructors
    public BookInventoryInfo() {}

    public BookInventoryInfo(Long id, String title, String description, Year publishedYear,
                             String linkFile, Integer totalStock, Integer availableStock,
                             Long borrowingCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.publishedYear = publishedYear;
        this.linkFile = linkFile;
        this.totalStock = totalStock;
        this.availableStock = availableStock;
        this.borrowingCount = borrowingCount;
    }

    // Getters và Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Year getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Year publishedYear) { this.publishedYear = publishedYear; }

    public String getLinkFile() { return linkFile; }
    public void setLinkFile(String linkFile) { this.linkFile = linkFile; }

    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }

    public Long getBorrowingCount() { return borrowingCount; }
    public void setBorrowingCount(Long borrowingCount) { this.borrowingCount = borrowingCount; }
}
