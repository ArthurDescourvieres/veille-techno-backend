package com.arthur.kanban_api.controller;

import com.arthur.kanban_api.dto.UpdateUserRequest;
import com.arthur.kanban_api.dto.UserResponse;
import com.arthur.kanban_api.entity.User;
import com.arthur.kanban_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(toResponse(user)))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé")));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody UpdateUserRequest request,
                                    Authentication authentication) {
        // Règles d'accès:
        // - L'utilisateur peut modifier son propre compte (email/password)
        // - Seul ROLE_ADMIN peut modifier le rôle OU modifier un autre utilisateur
        String requesterEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return userService.findById(id).map(existing -> {
            boolean isSelf = existing.getEmail().equalsIgnoreCase(requesterEmail);
            if (!isSelf && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
            }

            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                String newEmail = request.getEmail().trim();
                if (!newEmail.equalsIgnoreCase(existing.getEmail()) && userService.existsByEmail(newEmail)) {
                    return ResponseEntity.status(409).body(Map.of("error", "Email déjà utilisé"));
                }
                existing.setEmail(newEmail);
            }

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            if (request.getRole() != null && !request.getRole().isBlank()) {
                if (!isAdmin) {
                    return ResponseEntity.status(403).body(Map.of("error", "Seul un administrateur peut modifier le rôle"));
                }
                existing.setRole(request.getRole().trim());
            }

            User saved = userService.save(existing);
            return ResponseEntity.ok(toResponse(saved));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé")));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}


