package com.arthur.kanban_api.dto;

import jakarta.validation.constraints.Min;

public class CardUpdateRequest {

    private String title;
    private String description;

    @Min(value = 0, message = "La position doit être >= 0")
    private Integer position;

    private Long listId; // Permettre de déplacer une carte vers une autre liste

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Long getListId() { return listId; }
    public void setListId(Long listId) { this.listId = listId; }
}


