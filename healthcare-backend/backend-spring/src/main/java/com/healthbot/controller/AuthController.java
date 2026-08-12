package com.healthbot.controller;

import com.healthbot.entity.User;
import com.healthbot.repository.UserRepository;
import com.healthbot.service.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ---- Request DTOs ----

    public static class RegisterRequest {
        @Email(message = "Please enter a valid email address")
        @NotBlank(message = "Email is required")
        public String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        public String password;

        public String name;
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        public String email;

        @NotBlank(message = "Password is required")
        public String password;
    }

    // ---- Endpoints ----

    /**
     * POST /api/auth/register
     * Validates email + password, checks for duplicates,
     * saves BCrypt-hashed password, returns JWT.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        // Normalize email to lowercase
        String email = req.email.trim().toLowerCase();

        // Check for duplicate email
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "An account with this email already exists."));
        }

        // Hash the password — plaintext is NEVER stored
        String hashedPassword = passwordEncoder.encode(req.password);

        // Persist the new user
        User user = new User(email, hashedPassword);
        userRepository.save(user);

        // Issue JWT
        String token = jwtUtil.generateToken(email);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "token", token,
                "email", email,
                "message", "Account created successfully!"
        ));
    }

    /**
     * POST /api/auth/login
     * Verifies email + password, returns JWT on success.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String email = req.email.trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(email);

        // Check user exists and password matches
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.password, userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Incorrect email or password."));
        }

        // Issue JWT
        String token = jwtUtil.generateToken(email);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email,
                "message", "Logged in successfully!"
        ));
    }
}
