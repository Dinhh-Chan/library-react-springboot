package com.example.library_management.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name ="inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ một-một với Book
    @OneToOne
    @JoinColumn(name="book_id", nullable=false, unique=true)
    @JsonManagedReference("book-inventory") // Phía quản lý của mối quan hệ
    private Book book;

    @Column(name="total_stock", nullable= false)
    private Integer totalStock;

    @Column(name="available_stock", nullable=false)
    private Integer availableStock;

    public Inventory(){}

    public Inventory(Book book, Integer totalStock, Integer availableStock) {
        this.book = book;
        this.totalStock = totalStock;
        this.availableStock = availableStock;
    }

    // Getters và Setters

    public Long getId() {
        return id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
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
