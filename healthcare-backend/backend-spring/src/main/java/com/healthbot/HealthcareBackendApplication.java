package com.healthbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

// Exclude Spring Boot's auto-generated InMemoryUserDetailsManager —
// we manage our own users in PostgreSQL via UserRepository + JwtAuthFilter.
@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
public class HealthcareBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthcareBackendApplication.class, args);
    }
}
