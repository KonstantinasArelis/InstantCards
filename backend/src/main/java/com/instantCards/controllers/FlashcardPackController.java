package com.instantCards.controllers;

import com.instantCards.contracts.FlashcardDto;
import com.instantCards.contracts.FlashcardPackDto;
import com.instantCards.entities.Flashcard;
import com.instantCards.entities.FlashcardPack;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import lombok.Getter;
import lombok.Setter;
import com.instantCards.persistance.FlashcardPackDAO;

import java.util.ArrayList;
import java.util.List;
import java.net.URI;

@ApplicationScoped
@Path("/flashcardPack")
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardPackController {
    //@PersistenceContext(unitName = "myPersistenceUnit")
    @Inject
    @Setter @Getter
    private FlashcardPackDAO flashcardPackDAO;

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcardPack(@PathParam("id") Long id) {
        try{
            FlashcardPack retrievedFlashcardPack = flashcardPackDAO.findById(id);
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
            List<FlashcardPack> allFlashcardPacks = flashcardPackDAO.getAllFlashcardPacks();
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
            flashcardPackDAO.addFlashcardPack(newFlashcardPack);

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
            FlashcardPack flashcardPack = flashcardPackDAO.findById(id);
            if(flashcardPack != null){
                flashcardPack.getFlashcards().clear();
                flashcardPack.setName(updatedFlashcardPackDto.getName());

                for(FlashcardDto newFlashcardDto : updatedFlashcardPackDto.getFlashcards()){
                    flashcardPack.getFlashcards().add(new Flashcard(newFlashcardDto, flashcardPack));
                }
                flashcardPackDAO.updateFlashcardPack(flashcardPack);

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
            FlashcardPack toBeDeletedFlashcardPack = flashcardPackDAO.findById(id);
            if(toBeDeletedFlashcardPack != null){
                flashcardPackDAO.deleteFlashcardPack(toBeDeletedFlashcardPack);
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