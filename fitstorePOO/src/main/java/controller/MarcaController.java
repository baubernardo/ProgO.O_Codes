package controller;

import br.com.empresa.model.Marca;
import br.com.empresa.service.MarcaService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;

import java.util.List;

@Path("/marcas")
public class MarcaController {

    @Inject
    private MarcaService marcaService;

    @GET
    public RestResponse<List<Marca>> buscarTodas() {
        List<Marca> lista = MarcaService.ListAll();
        return RestResponse.ok(lista);
    }

    @POST
    public RestResponse<Marca> save(Marca marca) {
        Marca marcaSaved = MarcaService.save(marca);
        return RestResponse
                .ResponseBuilder
                .ok(marcaSaved)
                .status(Response.Status.CREATED)
                .build();
    }
}
