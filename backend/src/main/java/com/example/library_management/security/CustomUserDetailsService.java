package com.example.library_management.security;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.library_management.entity.Reader;
import com.example.library_management.repository.ReaderRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ReaderRepository readerRepository;

    public CustomUserDetailsService(ReaderRepository readerRepository) {
        this.readerRepository = readerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Reader reader = readerRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        GrantedAuthority authority = (GrantedAuthority) reader.getRole().getGrantedAuthority();

        // Sử dụng List.of() để tạo danh sách các GrantedAuthority
        return new User(
                reader.getUsername(),
                reader.getPassword(),
                List.of(authority)
        );
    }
    
}
