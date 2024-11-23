package com.example.library_management.enums;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
public enum  UserRole {
    ADMIN,
    USER;
    public GrantedAuthority getGrantedAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + this.name());
    }
}
