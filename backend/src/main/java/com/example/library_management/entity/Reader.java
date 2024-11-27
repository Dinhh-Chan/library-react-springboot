package com.example.library_management.entity;

import java.util.Set;
import java.util.Date;

import com.example.library_management.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "readers")
public class Reader {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_va_ten", nullable = false)
    private String hoVaTen;  // Tên đầy đủ của độc giả

    @Column(name = "quota", nullable = false)
    private Integer quota;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "number_phone")
    private String numberPhone;  // Số điện thoại

    @Column(name = "email", nullable = false, unique = true)
    private String email;  // Email của độc giả

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role; // ADMIN hoặc USER

    @Column(name = "date_of_birth")
    private Date dateOfBirth; // Ngày sinh của độc giả

    // Mối quan hệ một-nhiều với Borrowing
    @OneToMany(mappedBy = "reader", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("reader-borrowings") // Phía ngược lại của mối quan hệ
    private Set<Borrowing> borrowings;

    // Mối quan hệ một-nhiều với Report (Độc giả có thể tạo nhiều báo cáo)
    @OneToMany(mappedBy = "reader", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("reader-reports") // Phía ngược lại của mối quan hệ
    private Set<Report> reports;

    // Constructors
    public Reader() {}

    public Reader(String hoVaTen, Integer quota, String username, String password, String numberPhone, String email, UserRole role) {
        this.hoVaTen = hoVaTen;
        this.quota = quota;
        this.username = username;
        this.password = password;
        this.numberPhone = numberPhone;
        this.email = email;
        this.role = role;
    }
    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHoVaTen() {
        return hoVaTen;
    }

    public void setHoVaTen(String hoVaTen) {
        this.hoVaTen = hoVaTen;
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

    public String getNumberPhone() {
        return numberPhone;
    }

    public void setNumberPhone(String numberPhone) {
        this.numberPhone = numberPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Set<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(Set<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }

    public Set<Report> getReports() {
        return reports;
    }

    public void setReports(Set<Report> reports) {
        this.reports = reports;
    }
}
