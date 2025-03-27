package com.instantCards.contracts;

import java.util.List;

public interface IFlashcardPackService {
    public FlashcardPackDto getFlashcardPack(Long id);
    public List<FlashcardPackDto> getAllFlashcardPacks();
    public FlashcardPackDto createFlashcardPack(FlashcardPackDto newFlashcardPackDto);
    public FlashcardPackDto updateFlashcardPack(Long id, FlashcardPackDto flashcardPackDto);
    public void deleteFlashcardPack(Long id);
}
