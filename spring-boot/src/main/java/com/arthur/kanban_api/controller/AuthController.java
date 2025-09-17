package com.arthur.kanban_api.controller;

import com.arthur.kanban_api.dto.LoginRequest;
import com.arthur.kanban_api.dto.RegisterRequest;
import com.arthur.kanban_api.entity.User;
import com.arthur.kanban_api.security.JwtService;
import com.arthur.kanban_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserService userService,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest input) {
        if (userService.existsByEmail(input.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }
        User user = new User();
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        if (input.getRole() == null || input.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        } else {
            user.setRole(input.getRole());
        }
        User saved = userService.save(user);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "email", saved.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest payload) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(payload.getEmail(), payload.getPassword())
        );
        String token = jwtService.generateToken(payload.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }
}


