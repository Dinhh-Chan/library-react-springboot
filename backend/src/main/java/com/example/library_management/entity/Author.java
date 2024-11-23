package com.example.library_management.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name ="authors")
public class Author {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "name", nullable= false )
    private String name; 

    @Column(name="bio", columnDefinition= "TEXT")
    private String bio ;

    // Mối quan hệ nhiều-nhiều với Book
    @ManyToMany(mappedBy="authors")
    @JsonBackReference("book-authors") // Phía ngược lại của mối quan hệ
    private Set<Book> books;

    public Author(){}

    public Author(String name, String bio){
        this.name = name;
        this.bio = bio;
    }

    // Getters và Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

    public Set<Book> getBooks() {
        return books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }   
}
