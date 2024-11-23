package com.example.library_management.dto;

import com.example.library_management.entity.Author;

public class AuthorRequest {
    private String name;
    private String bio;

    // Getters và Setters

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

    // Phương thức chuyển đổi DTO thành Entity
    public Author toAuthor() {
        Author author = new Author();
        author.setName(this.name);
        author.setBio(this.bio);
        return author;
    }
}
