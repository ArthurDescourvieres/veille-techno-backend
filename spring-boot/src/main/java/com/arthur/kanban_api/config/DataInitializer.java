package com.arthur.kanban_api.config;

import com.arthur.kanban_api.entity.User;
import com.arthur.kanban_api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.IntStream;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            long existingCount = userRepository.count();
            if (existingCount >= 10) {
                return;
            }

            IntStream.rangeClosed(1, 10)
                .mapToObj(i -> String.format("user%02d@example.com", i))
                .filter(email -> !userRepository.existsByEmail(email))
                .forEach(email -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode("Motdepasse123"));
                    user.setRole("ROLE_USER");
                    userRepository.save(user);
                });
        };
    }
}


