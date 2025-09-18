package br.edu.setrem.meuapp.aula;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/caixa-eletronico")
public class CaixaEletronicoController {

    @Inject
    private ContaCorrente contaCorrente;

    @GET
    public Double verSaldo() {
        return contaCorrente.retornaSaldo();
    }

    @POST
    @Path("/depositar")
    @Consumes("*/*")
    public String depositar(Double valor) {
        contaCorrente.depositar(valor);
        return "OK";
    }

    @POST
    @Path("/sacar")
    @Consumes("*/*")
    public String sacar(Double valor) throws Exception {
        contaCorrente.sacar(valor);
        return "OK";
    }

}
