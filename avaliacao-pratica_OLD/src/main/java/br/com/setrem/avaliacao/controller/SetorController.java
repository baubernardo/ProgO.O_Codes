package br.com.setrem.avaliacao.controller;

import br.com.setrem.avaliacao.model.Setor;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/setor")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SetorController {

    @GET
    public List<Setor> listarTodos() {
        return Setor.listAll();
    }

    @POST
    @Transactional
    public Response registrarNovo(Setor setor) {
        setor.persist();
        return Response.status(Response.Status.CREATED).entity(setor).build();
    }
}