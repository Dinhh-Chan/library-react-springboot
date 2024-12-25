package com.example.library_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.example.library_management.dto.ReaderRequest;
import com.example.library_management.entity.Reader;
import com.example.library_management.exception.AuthenticationFailedException;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.service.ReaderService;
import com.example.library_management.service.EmailService;
import com.example.library_management.service.ReaderService;
@RestController
@RequestMapping("/api/readers")
public class ReaderController {

    private final ReaderService readerService;
    private final EmailService emailService;
    @Autowired
    public ReaderController(ReaderService readerService, EmailService emailService) {
        this.readerService = readerService;
        this.emailService = emailService;
    }

    // Lấy tất cả người đọc
    @GetMapping
    public List<Reader> getAllReaders() {
        return readerService.getAllReaders();
    }

    // Lấy người đọc theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Reader> getReaderById(@PathVariable Long id) {
        return readerService.getReaderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo người đọc mới
    @PostMapping
    public ResponseEntity<Reader> createReader(@RequestBody ReaderRequest readerRequest) {
        // Chuyển DTO thành entity và tạo mới người đọc
        Reader reader = readerRequest.toReader();
        Reader createdReader = readerService.createReader(reader);
        return ResponseEntity.status(201).body(createdReader);
    }

    // Cập nhật người đọc
    @PutMapping("/{id}")
    public ResponseEntity<Reader> updateReader(@PathVariable Long id, @RequestBody ReaderRequest readerRequest) {
        try {
            // Chuyển DTO thành entity và cập nhật người đọc
            Reader readerDetails = readerRequest.toReader();
            Reader updatedReader = readerService.updateReader(id, readerDetails);

            // Sau khi cập nhật thành công, gửi email thông báo
            if (readerRequest.getPassword() != null && !readerRequest.getPassword().isEmpty()) {
                emailService.sendPasswordChangeNotification(updatedReader.getEmail(), readerRequest.getPassword());
            }

            return ResponseEntity.ok(updatedReader);
        } catch (ResourceNotFoundException ex) {
            // Nếu không tìm thấy người đọc
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa người đọc
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReader(@PathVariable Long id) {
        try {
            readerService.deleteReader(id);
            return ResponseEntity.noContent().build();  // Thành công, trả về 204 No Content
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();  // Nếu không tìm thấy người đọc, trả về 404 Not Found
        }
    }

    // Đăng nhập người đọc
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            // Xác thực người đọc
            Reader authenticatedReader = readerService.authenticate(username, password);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Login successful",
                            "id", authenticatedReader.getId(),
                            "role", authenticatedReader.getRole()
                    ));
        } catch (AuthenticationFailedException e) {
            // Nếu xác thực không thành công
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
        // Endpoint "Quên Mật Khẩu"
        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
            String email = request.get("email");
            Optional<Reader> optionalReader = readerService.getReaderByEmail(email);
            if (optionalReader.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Email không tồn tại trong hệ thống."));
            }
    
            Reader reader = optionalReader.get();
    
            // Tạo mật khẩu ngẫu nhiên
            String newPassword = generateRandomPassword(8);
    
            // Cập nhật mật khẩu mới 
            readerService.updatePassword(reader.getId(), newPassword);
    
            // Gửi email với mật khẩu mới
            String subject = "Khôi Phục Mật Khẩu - Hệ Thống Quản Lý Thư Viện";
            String body = "Chào " + reader.getHoVaTen() + ",<br/><br/>"
                        + "Mật khẩu mới của bạn là: <strong>" + newPassword + "</strong><br/><br/>"
                        + "Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập.<br/><br/>"
                        + "Trân trọng,<br/>"
                        + "Hệ Thống Quản Lý Thư Viện";
    
            emailService.sendEmail(reader.getEmail(), subject, body);
    
            return ResponseEntity.ok(Map.of("message", "Mật khẩu mới đã được gửi đến email của bạn."));
        }
    
        // Hàm tạo mật khẩu ngẫu nhiên
        private String generateRandomPassword(int length) {
            String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
            StringBuilder sb = new StringBuilder();
            for(int i=0; i<length; i++) {
                int index = (int)(Math.random() * chars.length());
                sb.append(chars.charAt(index));
            }
            return sb.toString();
        }
    
}
