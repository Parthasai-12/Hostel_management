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
        // Step 1: Delete all existing ADMIN users
        List<User> existingAdmins = userRepository.findByRole(User.Role.ADMIN);
        if (!existingAdmins.isEmpty()) {
            userRepository.deleteAll(existingAdmins);
            System.out.println("[DataInitializer] Deleted " + existingAdmins.size() + " existing ADMIN user(s).");
        }

        // Step 2: Create a fresh default admin
        User admin = new User();
        admin.setName(ADMIN_NAME);
        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        System.out.println("[DataInitializer] New default admin created — email: " + ADMIN_EMAIL);

        // Step 3: Verify the save by re-reading from DB
        User verify = userRepository.findByEmail(ADMIN_EMAIL);
        if (verify != null) {
            boolean matches = passwordEncoder.matches(ADMIN_PASSWORD, verify.getPassword());
            System.out.println("[DataInitializer] Verification — found in DB: true | password matches: " + matches + " | role: " + verify.getRole());
        } else {
            System.out.println("[DataInitializer] ERROR — admin NOT found in DB after save!");
        }

        System.out.println("[DataInitializer] Ready to login with: " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
    }
}
