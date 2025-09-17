package com.arthur.kanban_api.service;

import com.arthur.kanban_api.entity.KanbanList;
import com.arthur.kanban_api.repository.KanbanListRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class KanbanListService {

    private final KanbanListRepository repository;

    public KanbanListService(KanbanListRepository repository) {
        this.repository = repository;
    }

    public KanbanList save(KanbanList list) {
        return repository.save(list);
    }

    public Optional<KanbanList> findById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}


