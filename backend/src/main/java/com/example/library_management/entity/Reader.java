package com.example.library_management.entity;

import java.util.Set;

import com.example.library_management.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "readers")
public class Reader {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "quota", nullable = false)
    private Integer quota;

    // @Column(name ="name", nullable= false)
    // private String name;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role; // ADMIN hoặc USER

    // Mối quan hệ một-nhiều với Borrowing
    @OneToMany(mappedBy = "reader", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("reader-borrowings") // Phía ngược lại của mối quan hệ
    private Set<Borrowing> borrowings;

    // Constructors
    public Reader() {}

    public Reader(String contactInfo, Integer quota, String username, String password, UserRole role) {
        this.contactInfo = contactInfo;
        this.quota = quota;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters và Setters

    public Long getId() {
        return id;
    }

    public String getContactInfo() {
        return contactInfo;
    }

	public void setContactInfo(String contactInfo) {
		this.contactInfo = contactInfo;
	}

    public Integer getQuota() {
        return quota;
    }

    public void setQuota(Integer quota) {
        this.quota = quota;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

	public void setPassword(String password) {
		this.password = password;
	}

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Set<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(Set<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }
}
