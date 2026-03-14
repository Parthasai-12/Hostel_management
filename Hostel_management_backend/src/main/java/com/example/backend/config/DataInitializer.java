package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * DEV-ONLY: Resets admin accounts on every startup.
 * Deletes all existing ADMIN users, then creates a fresh default admin.
 * Remove or disable this class before going to production.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String ADMIN_EMAIL    = "admin@hostel.com";
    private static final String ADMIN_NAME     = "Main Admin";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Override
    @Transactional
    public void run(String... args) {
        // Find existing admin by email
        User existingAdmin = userRepository.findByEmail(ADMIN_EMAIL);

        if (existingAdmin != null) {
            System.out.println("[DataInitializer] Default admin already exists. Updating password/role to ensure it's correct.");
            existingAdmin.setName(ADMIN_NAME);
            existingAdmin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            existingAdmin.setRole(User.Role.ADMIN);
            userRepository.save(existingAdmin);
        } else {
            System.out.println("[DataInitializer] No default admin found. Creating one.");
            User admin = new User();
            admin.setName(ADMIN_NAME);
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        System.out.println("[DataInitializer] Ready to login with: " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
    }
}
