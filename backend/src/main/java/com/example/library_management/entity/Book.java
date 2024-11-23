package com.example.library_management.entity;

import java.time.Year;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name ="books")
public class Book {
    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name ="title", nullable= false)
    private String title;

    @Column(name = "description", nullable = false,columnDefinition = "TEXT")
    private String description;

    @Column(name = "published_year", nullable= false)
    private Year published_year;

    // @Column(name = "quantity", nullable= false )
    // private Integer quantity;

    @Column(name = "link_file", nullable = false)
    private String link_file;

    // Mối quan hệ nhiều-nhiều với Category
    @ManyToMany
    @JsonManagedReference("book-categories") // Đặt tên cho mối quan hệ
    @JoinTable(
        name = "book_categories", 
        joinColumns= @JoinColumn(name ="book_id"),
        inverseJoinColumns= @JoinColumn(name ="category_id")
    )
    private Set<Category> categories;

    // Mối quan hệ nhiều-nhiều với Author
    @ManyToMany
    @JsonManagedReference("book-authors") // Đặt tên cho mối quan hệ
    @JoinTable(
        name ="book_authors",
        joinColumns= @JoinColumn(name="book_id"),
        inverseJoinColumns= @JoinColumn(name = "author_id")
    )
    private Set<Author> authors;

    // Mối quan hệ một-một với Inventory
    @OneToOne(mappedBy= "book", cascade= CascadeType.ALL, fetch= FetchType.LAZY, optional= true)
    @JsonBackReference("book-inventory") // Phía ngược lại của mối quan hệ
    private Inventory inventory ; 

    // Mối quan hệ một-nhiều với Borrowing
    @OneToMany(mappedBy= "book", cascade= CascadeType.ALL, orphanRemoval=true)
    @JsonBackReference("book-borrowings") // Phía ngược lại của mối quan hệ
    private Set<Borrowing> borrowings;

    public Book(){
    }

    public Book(String title, Integer quantity, String link_file, String description, Year published_year){
        this.title = title;
        // this.quantity = quantity;
        this.link_file = link_file; // Sửa lại nếu cần
        this.description = description;
        this.published_year = published_year;
    }

    // Getters và Setters

    public Long getId(){
        return id;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    // public Integer getQuantity(){
    //     return quantity;
    // }

    // public void setQuantity(Integer quantity){
    //     this.quantity = quantity;
    // }

    public String getFile(){
        return link_file;
    }

    public void setFile(String link_file){
        this.link_file = link_file;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public Year getPubshedYear(){
        return published_year;
    }

    public void setPublishedYear(Year published_year){
        this.published_year = published_year;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
        if (inventory != null) {
            inventory.setBook(this);
        }
    }

    public Set<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(Set<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }
}
