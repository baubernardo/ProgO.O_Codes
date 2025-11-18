package br.com.empresa.service;

import br.com.empresa.model.Marca;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class MarcaService {

    public static List<Marca> ListAll() {
        return Marca.listAll();
    }

    @Transactional
    public static Marca save(Marca marca){
        Marca.persist(marca);
        return marca;
    }
}
