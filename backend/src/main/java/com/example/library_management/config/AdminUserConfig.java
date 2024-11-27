package com.example.library_management.config;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.library_management.entity.Reader;
import com.example.library_management.enums.UserRole;
import com.example.library_management.repository.ReaderRepository;

@Configuration
public class AdminUserConfig {

    @Bean
    public CommandLineRunner createAdminUser(ReaderRepository readerRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<Reader> existingAdmin = readerRepository.findByUsername("admin");

            if (existingAdmin.isEmpty()) {
                // Tạo người dùng mới với vai trò ADMIN
                Reader admin = new Reader(
                        "Admin Full Name", // Tên đầy đủ của admin
                        10, // Quota mặc định
                        "admin", // Tên người dùng
                        passwordEncoder.encode("admin"), // Mã hóa mật khẩu
                        "admin_phone_number", // Số điện thoại admin
                        "admin@example.com", // Email admin
                        UserRole.ADMIN // Vai trò ADMIN
                );
                
                readerRepository.save(admin);
                System.out.println("Admin user created successfully!");
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
