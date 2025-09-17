package com.arthur.kanban_api.controller;

import com.arthur.kanban_api.dto.ListCreateRequest;
import com.arthur.kanban_api.dto.ListResponse;
import com.arthur.kanban_api.entity.KanbanList;
import com.arthur.kanban_api.entity.User;
import com.arthur.kanban_api.service.KanbanListService;
import com.arthur.kanban_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
@Tag(name = "Lists", description = "Endpoints de gestion des listes Kanban")
public class ListController {

    private final KanbanListService listService;
    private final UserService userService;

    public ListController(KanbanListService listService, UserService userService) {
        this.listService = listService;
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Créer une liste", description = "Crée une nouvelle liste pour l'utilisateur connecté")
    public ResponseEntity<?> create(@Valid @RequestBody ListCreateRequest request, Authentication authentication) {
        String email = authentication.getName();
        User owner = userService.findByEmail(email).orElse(null);
        if (owner == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé"));
        }
        KanbanList list = new KanbanList();
        list.setTitle(request.getTitle().trim());
        list.setPosition(request.getPosition() != null ? request.getPosition() : 0);
        list.setOwner(owner);
        KanbanList saved = listService.save(list);
        return ResponseEntity.created(URI.create("/api/lists/" + saved.getId())).body(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une liste", description = "Supprime une liste si on est propriétaire ou admin")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        return listService.findById(id).map(existing -> {
            String requesterEmail = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = existing.getOwner().getEmail().equalsIgnoreCase(requesterEmail);
            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
            }
            listService.deleteById(existing.getId());
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Liste non trouvée")));
    }

    private ListResponse toResponse(KanbanList list) {
        return new ListResponse(
                list.getId(),
                list.getTitle(),
                list.getPosition(),
                list.getOwner().getId(),
                list.getCreatedAt(),
                list.getUpdatedAt()
        );
    }
}