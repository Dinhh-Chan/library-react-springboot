package com.example.library_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);  // Chuyển body thành HTML nếu cần
            mailSender.send(message);
        } catch (jakarta.mail.MessagingException e) {
            e.printStackTrace();  // In ra lỗi nếu có
        }
    }
    public void sendPasswordChangeNotification(String email, String newPassword) {
        // Tạo nội dung email
        String subject = "Thông báo thay đổi mật khẩu";
        String message = "Chào bạn,\n\n" +
                         "Mật khẩu của bạn đã được thay đổi thành công. Mật khẩu mới của bạn là: " + newPassword +
                         "\n\nTrân trọng,\nLibrary Management System";

        // Gửi email
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(message);
            mailSender.send(mimeMessage);  // Gửi email
        } catch (MessagingException e) {
            e.printStackTrace();  // Xử lý lỗi gửi email
            throw new RuntimeException("Không thể gửi email thông báo thay đổi mật khẩu", e);
        }
    }
}
