package br.com.setrem.avaliacao.controller;

import br.com.setrem.avaliacao.model.Equipamento;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/equipamentos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipamentoController {

    @GET
    public List<Equipamento> listarTodos() {
        return Equipamento.listAll();
    }

    @POST
    @Transactional
    public Response registrarNovo(Equipamento equipamento) {
        equipamento.persist();
        return Response.status(Response.Status.CREATED).entity(equipamento).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response atualizar(@PathParam("id") Long id, Equipamento equipamentoAtualizado) {
        Optional<Equipamento> equipamentoOpt = Equipamento.findByIdOptional(id);
        if (equipamentoOpt.isPresent()) {
            Equipamento equipamento = equipamentoOpt.get();
            equipamento.setCodigo(equipamentoAtualizado.getCodigo());
            equipamento.setNumeroSerie(equipamentoAtualizado.getNumeroSerie());
            equipamento.setUsuario(equipamentoAtualizado.getUsuario());
            equipamento.setDataValidacao(equipamentoAtualizado.getDataValidacao());
            equipamento.setSetor(equipamentoAtualizado.getSetor());
            equipamento.persist();
            return Response.ok(equipamento).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response remover(@PathParam("id") Long id) {
        boolean deletado = Equipamento.deleteById(id);
        if (deletado) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}