package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            if (user.getEmail().contains("admin")) {
                user.setRole(User.Role.ADMIN);
            } else {
                user.setRole(User.Role.STUDENT);
            }
        }
        return userRepository.save(user);
    }

    public String login(String email, String password) {
        System.out.println("[AuthService] Login attempt — email='" + email + "'");
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("[AuthService] FAIL — no user found for email='" + email + "'");
            throw new IllegalArgumentException("Invalid credentials");
        }
        System.out.println("[AuthService] User found — id=" + user.getId() + " role=" + user.getRole());
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("[AuthService] Password matches: " + passwordMatches);
        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (user.getRole() == null) {
            user.setRole(User.Role.STUDENT);
            userRepository.save(user);
        }
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }
}
