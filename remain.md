Ce qu’il manque pour coller à la consigne et à Spring Security

Rôles: la consigne demande des rôles. Il faut un champ roles (par exemple un Set<Role> ou Set<String>).
Sérialisation: protéger le mot de passe à l’export JSON (@JsonIgnore sur password).


Validation: ajouter des contraintes Bean Validation:
@Email + @NotBlank sur email
@NotBlank + éventuellement @Size(min=8) sur password
Audit (optionnel mais utile): createdAt / updatedAt avec @CreationTimestamp / @UpdateTimestamp ou @PrePersist / @PreUpdate.


Intégration Spring Security (recommandé): implémenter UserDetails pour faciliter l’authentification (ou fournir un adapter). Champs utiles si tu l’implémentes:
enabled, accountNonExpired, accountNonLocked, credentialsNonExpired
Égalité/hash (bonne pratique): equals/hashCode basés sur l’id ou l’email.
Exemple minimal recommandé pour démarrer
Un enum Role { USER, ADMIN }
Dans User:
Set<Role> roles persistant via @ElementCollection + @Enumerated(EnumType.STRING)
Getters/setters pour email, password, roles
@JsonIgnore sur password
@Email, @NotBlank et @NotBlank sur les champs
(Optionnel) createdAt, updatedAt