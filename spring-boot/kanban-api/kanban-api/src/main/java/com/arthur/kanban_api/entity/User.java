package com.arthur.kanban_api.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity //ça permet de déclarer à l'environnement qu'il s'agit d'un fichier entité
@Table(name = "users") //ça permet de déclarer la table dans la base de données
public class User {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)// pas compris toute la partie
      private Long id; // pas compris private et long

      @Column(unique = true, nullable = false) // déclare une colonne/champ et annonce que ça sera impossible d'etre null et que la donnée est unique donc aucun autre user ne peux avoir le meme email
      private String email;

      @Column(nullable = false) // meme principe que le précédent
      @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
      private String password;

      @Column(nullable = false)
      private String role;

      public User() {}

      public Long getId() { return id; }

      public String getEmail() { return email; }

      public void setEmail(String email) { this.email = email; }

      public String getPassword() { return password; }

      public void setPassword(String password) { this.password = password; }

      public String getRole() { return role; }

      public void setRole(String role) { this.role = role; }
}