package com.arthur.kanban_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterRequest {

    @Schema(description = "Adresse email de l'utilisateur", example = "example@gmail.com")
    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @Schema(description = "Mot de passe (minimum 8 caractères)", example = "Motdepasse123")
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;

    @Schema(description = "Rôle de l'utilisateur (optionnel, par défaut ROLE_USER)", example = "ROLE_USER")
    // Optionnel: si non fourni on mettra ROLE_USER
    private String role;

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}


