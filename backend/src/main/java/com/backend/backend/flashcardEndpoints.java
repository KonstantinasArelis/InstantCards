package com.backend.backend;

import contracts.FlashcardDto;
import entities.Flashcard;
import entities.FlashcardPack;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import persistance.FlashcardDAO;
import persistance.FlashcardPackDAO;

import java.net.URI;

@Path("/flashcard")
@Produces(MediaType.APPLICATION_JSON)
public class flashcardEndpoints {
    @Inject
    private FlashcardDAO flashcardDAO;
    @Inject
    private FlashcardPackDAO flashcardPackDAO;

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcard(@PathParam("id") Long id){
        try {
            Flashcard flashcard = flashcardDAO.findById(id);
            if(flashcard == null){
                return Response.status(Response.Status.NOT_FOUND).entity("\"Flashcard pack with id \" + id + \" not found\"").build();
            } else {
                FlashcardDto flashcardData = new FlashcardDto(flashcard);
                return Response.ok(flashcardData).build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addFlashcard(FlashcardDto flashcardData) {
        try {
            FlashcardPack retrievedFlashcardPack = flashcardPackDAO.findById(flashcardData.getFlashcardPackId());
            if(retrievedFlashcardPack == null){
                return Response.status(Response.Status.NOT_FOUND).entity("Adding flashcard to flashcard pack not possible: Flashcard Pack with id " + flashcardData.getFlashcardPackId() + " was not found").build();
            }
            Flashcard newFlashcard = new Flashcard(
                    flashcardData.getQuestion(),
                    flashcardData.getAnswer(),
                    retrievedFlashcardPack);
            flashcardDAO.addFlashcard(newFlashcard);

            flashcardData.setFlashcardPackId(retrievedFlashcardPack.getId());
            flashcardData.setId(newFlashcard.getId());

            URI uri = URI.create("api/flashcard/" + flashcardData.getId());
            return Response.created(uri).entity(flashcardData).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating flashcard: " + e.getMessage())
                    .build();
        }
    }
}
