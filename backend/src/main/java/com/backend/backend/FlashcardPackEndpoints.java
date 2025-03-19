package com.backend.backend;

import contracts.FlashcardPackDto;
import entities.FlashcardPack;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.net.URI;

@Path("/flashcardPack")
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardPackEndpoints {
    @PersistenceContext(unitName = "myPersistenceUnit")
    private EntityManager em;

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcardPack(@PathParam("id") Long id) {
        try{
            FlashcardPack retrievedFlashcardPack = em.find(FlashcardPack.class, id);
            if(retrievedFlashcardPack == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("\"Flashcard pack with id \" + id + \" not found\"").build();
            }
            FlashcardPackDto flashcardPackData = new FlashcardPackDto(retrievedFlashcardPack);

            return Response.ok(flashcardPackData).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/getAll")
    @Transactional
    public Response getAllFlashcardPacks() {
        try {
            List<FlashcardPack> allFlashcardPacks = em.createQuery("SELECT f FROM FlashcardPack f", FlashcardPack.class).getResultList();
            List<FlashcardPackDto> allFlashcardPacksData = new ArrayList<>();
            for(FlashcardPack flashcardPack : allFlashcardPacks){
                FlashcardPackDto flashcardPackData = new FlashcardPackDto(flashcardPack);
                allFlashcardPacksData.add(flashcardPackData);
            }

            return Response.ok(allFlashcardPacksData).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching all flashcardPacks: " + e.getMessage())
                    .build();
        }
    }

    @POST
    @Path("/create")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createFlashcardPack(FlashcardPackDto newFlashcardPackData) {
        try {
            FlashcardPack newFlashcardPack = new FlashcardPack(newFlashcardPackData);
            em.persist(newFlashcardPack);
            em.flush();

            URI createdUri = URI.create("/api/flashcardPack/" + newFlashcardPackData.getId());
            return Response.created(createdUri)
                    .entity(newFlashcardPackData)
                    .build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating flashcardPack: " + e.getMessage())
                    .build();
        }
    }
}