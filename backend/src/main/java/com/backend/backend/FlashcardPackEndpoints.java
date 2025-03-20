package com.backend.backend;

import contracts.FlashcardDto;
import contracts.FlashcardPackDto;
import entities.Flashcard;
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

    @PUT
    @Path("/update/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateFlashcardPack(@PathParam("id") Long id, FlashcardPackDto updatedFlashcardPackDto) {
        try {
            FlashcardPack flashcardPack = em.find(FlashcardPack.class, id);
            if(flashcardPack != null){
                flashcardPack.getFlashcards().clear();
                flashcardPack.setName(updatedFlashcardPackDto.getName());

                for(FlashcardDto newFlashcardDto : updatedFlashcardPackDto.getFlashcards()){
                    flashcardPack.getFlashcards().add(new Flashcard(newFlashcardDto, flashcardPack));
                }
                em.merge(flashcardPack);

                URI updatedUri = URI.create("/api/flashcardPack/" + flashcardPack.getId());
                return Response.created(updatedUri).entity(updatedFlashcardPackDto).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating flashcardPack: " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/delete/{id}")
    @Transactional
    public Response deleteFlashcardPack(@PathParam("id") Long id){
        try {
            FlashcardPack toBeDeletedFlashcardPack = em.find(FlashcardPack.class, id);
            if(toBeDeletedFlashcardPack != null){
                em.remove(toBeDeletedFlashcardPack);
                return Response.noContent().build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting flashcardPack: " + e.getMessage())
                    .build();
        }

    }
}