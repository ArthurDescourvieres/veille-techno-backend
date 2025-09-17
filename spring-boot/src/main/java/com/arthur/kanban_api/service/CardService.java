package com.arthur.kanban_api.service;

import com.arthur.kanban_api.entity.Card;
import com.arthur.kanban_api.entity.KanbanList;
import com.arthur.kanban_api.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public Card save(Card card) {
        return cardRepository.save(card);
    }

    public Optional<Card> findById(Long id) {
        return cardRepository.findById(id);
    }

    public void delete(Card card) {
        cardRepository.delete(card);
    }

    public List<Card> findByList(KanbanList list) {
        return cardRepository.findByListOrderByPositionAsc(list);
    }
}


