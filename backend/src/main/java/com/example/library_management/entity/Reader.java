package com.example.library_management.entity;

import java.util.Set;
import java.util.Date;

import com.example.library_management.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "readers")
public class Reader {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_va_ten")
    private String hoVaTen;

    @Column(name = "quota", nullable = false)
    private Integer quota;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "number_phone")
    private String numberPhone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @OneToMany(mappedBy = "reader", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("reader-borrowings")
    private Set<Borrowing> borrowings;

    // Thay đổi quan hệ với Report
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("sender-reports")
    private Set<Report> sentReports;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("receiver-reports")
    private Set<Report> receivedReports;

    // Constructors
    public Reader() {}

    public Reader(String hoVaTen, Integer quota, String username, String password, 
                 String numberPhone, String email, UserRole role) {
        this.hoVaTen = hoVaTen;
        this.quota = quota;
        this.username = username;
        this.password = password;
        this.numberPhone = numberPhone;
        this.email = email;
        this.role = role;
    }

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
    public Set<Report> getSentReports() {
        return sentReports;
    }

    public void setSentReports(Set<Report> sentReports) {
        this.sentReports = sentReports;
    }

    public Set<Report> getReceivedReports() {
        return receivedReports;
    }

    public void setReceivedReports(Set<Report> receivedReports) {
        this.receivedReports = receivedReports;
    }

    // Helper methods để quản lý quan hệ hai chiều
    public void addSentReport(Report report) {
        sentReports.add(report);
        report.setSender(this);
    }

    public void removeSentReport(Report report) {
        sentReports.remove(report);
        report.setSender(null);
    }

    public void addReceivedReport(Report report) {
        receivedReports.add(report);
        report.setReceiver(this);
    }

    public void removeReceivedReport(Report report) {
        receivedReports.remove(report);
        report.setReceiver(null);
    }
}