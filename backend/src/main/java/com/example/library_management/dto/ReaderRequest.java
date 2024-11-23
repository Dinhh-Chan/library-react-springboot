package com.example.library_management.dto;

import com.example.library_management.entity.Reader;
import com.example.library_management.enums.UserRole;

public class ReaderRequest {
    private String contactInfo;
    private Integer quota;
    private String username;
    private String password;
    private UserRole role;

    // Getters và Setters

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

    // Phương thức chuyển đổi DTO thành Entity
    public Reader toReader() {
        Reader reader = new Reader();
        reader.setContactInfo(this.contactInfo);
        reader.setQuota(this.quota);
        reader.setUsername(this.username);
        reader.setPassword(this.password);
        reader.setRole(this.role);
        return reader;
    }
}
