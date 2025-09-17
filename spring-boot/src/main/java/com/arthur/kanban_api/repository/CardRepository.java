package com.arthur.kanban_api.repository;

import com.arthur.kanban_api.entity.Card;
import com.arthur.kanban_api.entity.KanbanList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByListOrderByPositionAsc(KanbanList list);
}


