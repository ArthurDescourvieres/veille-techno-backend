package com.arthur.kanban_api.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity //ça permet de déclarer à l'environnement qu'il s'agit d'un fichier entité
@Table(name = "users") //ça permet de déclarer la table dans la base de données
public class User {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)// pas compris toute la partie
      private Long id; // pas compris private et long

      @Column(unique = true, nullable = false) // déclare une colonne/champ et annonce que ça sera impossible d'etre null et que la donnée est unique donc aucun autre user ne peux avoir le meme email
      @Email(message = "Email invalide")
      @NotBlank(message = "L'email est obligatoire")
      private String email;

      @Column(nullable = false) // meme principe que le précédent
      @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
      @NotBlank(message = "Le mot de passe est obligatoire")
      @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
      private String password;

      @Column(nullable = false)
      @NotBlank(message = "Le rôle est obligatoire")
      private String role;

      @CreationTimestamp
      @Column(updatable = false)
      private LocalDateTime createdAt;

      @UpdateTimestamp
      private LocalDateTime updatedAt;

      public User() {}

      public Long getId() { return id; }

      public String getEmail() { return email; }

      public void setEmail(String email) { this.email = email; }

      public String getPassword() { return password; }

      public void setPassword(String password) { this.password = password; }

      public String getRole() { return role; }

      public void setRole(String role) { this.role = role; }

      public LocalDateTime getCreatedAt() { return createdAt; }

      public LocalDateTime getUpdatedAt() { return updatedAt; }
}