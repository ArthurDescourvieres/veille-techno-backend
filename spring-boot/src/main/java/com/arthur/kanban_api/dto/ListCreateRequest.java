package com.arthur.kanban_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "ListCreateRequest")
public class ListCreateRequest {

    @NotBlank(message = "Le titre est requis")
    private String title;

    @Min(value = 0, message = "La position doit être >= 0")
    private Integer position;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}