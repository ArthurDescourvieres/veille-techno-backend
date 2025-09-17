package com.arthur.kanban_api.dto;

import java.time.Instant;

public class CardResponse {
    private final Long id;
    private final String title;
    private final String description;
    private final Integer position;
    private final Long listId;
    private final Long ownerId;
    private final Instant createdAt;
    private final Instant updatedAt;

    public CardResponse(Long id, String title, String description, Integer position, Long listId, Long ownerId, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.position = position;
        this.listId = listId;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getPosition() { return position; }
    public Long getListId() { return listId; }
    public Long getOwnerId() { return ownerId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}


