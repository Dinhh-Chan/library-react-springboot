package com.example.library_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.library_management.entity.Reader;
import com.example.library_management.exception.AuthenticationFailedException;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.ReaderRepository;

@Service
public class ReaderService {
    
    private final ReaderRepository readerRepository;
    private final PasswordEncoder passwordEncoder;

    public ReaderService(ReaderRepository readerRepository, PasswordEncoder passwordEncoder){
        this.readerRepository = readerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Lấy tất cả người đọc
    public List<Reader> getAllReaders(){
        return readerRepository.findAll();
    }

    // Lấy người đọc theo ID
    public Optional<Reader> getReaderById(Long id){
        return readerRepository.findById(id);
    }

    // Tạo người đọc mới
    public Reader createReader(Reader reader){
        // Mã hóa mật khẩu trước khi lưu
        reader.setPassword(passwordEncoder.encode(reader.getPassword()));
        return readerRepository.save(reader);
    }

    // Cập nhật người đọc
    public Reader updateReader(Long id, Reader readerDetails){
        return readerRepository.findById(id).map(reader -> {
            reader.setContactInfo(readerDetails.getContactInfo());
            reader.setQuota(readerDetails.getQuota());
            reader.setUsername(readerDetails.getUsername());
            if(readerDetails.getPassword() != null && !readerDetails.getPassword().isEmpty()){
                reader.setPassword(passwordEncoder.encode(readerDetails.getPassword()));
            }
            reader.setRole(readerDetails.getRole());
            // Cập nhật các thuộc tính khác nếu cần
            return readerRepository.save(reader);
        }).orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + id));
    }

    // Xóa người đọc
    public void deleteReader(Long id){
        readerRepository.deleteById(id);
    }

    public Reader authenticate(String username, String rawPassword) {
        Reader reader = readerRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationFailedException("Invalid username or password"));

        if (!passwordEncoder.matches(rawPassword, reader.getPassword())) {
            throw new AuthenticationFailedException("Invalid username or password");
        }

        return reader;
    }
}
