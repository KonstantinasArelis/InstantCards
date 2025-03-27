package com.instantCards.controllers;

import com.instantCards.contracts.FlashcardPackDto;
import com.instantCards.contracts.IFlashcardPackService;
import com.instantCards.services.FlashcardPackService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.UriBuilder;
import java.util.List;
import java.net.URI;

// TODO instead of controllers returning error message, log them internally

@ApplicationScoped
@Path("/flashcardPack")
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardPackController {
    @Inject
    private IFlashcardPackService flashcardPackService;

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcardPack(@PathParam("id") Long id) {
        try{
            FlashcardPackDto flashcardPackData = flashcardPackService.getFlashcardPack(id);
            return Response.ok(flashcardPackData).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
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
            List<FlashcardPackDto> allFlashcardPacksData = flashcardPackService.getAllFlashcardPacks();
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
    public Response createFlashcardPack(FlashcardPackDto newFlashcardPackDto) {
        try {
            //TODO make sure user does not provide id when creating flashcard pack
            FlashcardPackDto createdFlashcardPack = flashcardPackService.createFlashcardPack(newFlashcardPackDto);
            URI locationUri = UriBuilder
                    .fromResource(FlashcardPackController.class)
                    .path(String.valueOf(createdFlashcardPack.getId()))
                    .build();

            return Response.created(locationUri).entity(createdFlashcardPack).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }  catch (Exception e) {
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
    public Response updateFlashcardPack(@PathParam("id") Long id, FlashcardPackDto flashcardPackDto) {
        try {
            //TODO make sure user does not provide id when updating flashcard pack
            FlashcardPackDto updatedFlashcardPackDto = flashcardPackService.updateFlashcardPack(id, flashcardPackDto);
            return Response.ok(updatedFlashcardPackDto).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }  catch (Exception e) {
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
            flashcardPackService.deleteFlashcardPack(id);
            return Response.noContent().build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }  catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting flashcardPack: " + e.getMessage())
                    .build();
        }
    }
}