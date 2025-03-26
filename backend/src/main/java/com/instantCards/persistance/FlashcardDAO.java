package com.instantCards.persistance;

import com.instantCards.entities.Flashcard;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class FlashcardDAO {
    @Inject
    private EntityManager em;

    public Flashcard findById(Long id){
        return em.find(Flashcard.class, id);
    }

    public void addFlashcard(Flashcard flashcard){
        em.persist(flashcard);
    }
}
