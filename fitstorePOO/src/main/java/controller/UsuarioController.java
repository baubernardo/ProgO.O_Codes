package controller;

import br.com.empresa.model.Usuario;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.List;

@Path("/usuarios")
public class UsuarioController {

    @GET
    public List<Usuario> listar(){
        return Usuario.listAll();
    }

    @POST
    @Transactional
    public String inserir(Usuario usuario) {
        Usuario.persist(usuario);
        return "OK";
    }
}
