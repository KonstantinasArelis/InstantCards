package com.instantCards.contracts;

import com.instantCards.entities.Flashcard;
import com.instantCards.entities.FlashcardPack;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

public interface IFlashcardPackDao {
    public FlashcardPack findById(Long id);
    public List<FlashcardPack> getAllFlashcardPacks();
    public void addFlashcardPack(FlashcardPack flashcardPack);
    public void updateFlashcardPack(FlashcardPack flashcardPack);
    public void deleteFlashcardPack(FlashcardPack flashcardPack);
}
