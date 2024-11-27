package com.example.library_management.dto;

import com.example.library_management.entity.Reader;
import com.example.library_management.enums.UserRole;

public class ReaderRequest {
    private String numberPhone;
    private String email;
    private Integer quota;
    private String username;
    private String password;
    private UserRole role;

    // Getters và Setters

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

    // Phương thức chuyển đổi DTO thành Entity
    public Reader toReader() {
        Reader reader = new Reader();
        reader.setNumberPhone(this.numberPhone); // Cập nhật numberPhone
        reader.setEmail(this.email); // Cập nhật email
        reader.setQuota(this.quota);
        reader.setUsername(this.username);
        reader.setPassword(this.password);
        reader.setRole(this.role);
        return reader;
    }
}
