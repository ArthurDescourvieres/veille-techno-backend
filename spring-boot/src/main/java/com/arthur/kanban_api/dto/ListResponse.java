package com.arthur.kanban_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(name = "ListResponse")
public class ListResponse {
    private Long id;
    private String title;
    private Integer position;
    private Long ownerId;
    private Instant createdAt;
    private Instant updatedAt;

    public ListResponse(Long id, String title, Integer position, Long ownerId, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.position = position;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Integer getPosition() { return position; }
    public Long getOwnerId() { return ownerId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}


