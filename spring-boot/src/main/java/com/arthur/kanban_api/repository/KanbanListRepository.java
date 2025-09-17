package com.arthur.kanban_api.repository;

import com.arthur.kanban_api.entity.KanbanList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KanbanListRepository extends JpaRepository<KanbanList, Long> {
}


