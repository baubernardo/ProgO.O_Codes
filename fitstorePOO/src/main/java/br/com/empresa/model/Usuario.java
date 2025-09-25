package br.com.empresa.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")

public class Usuario extends PanacheEntity {
    @Column(name = "nome_completo", length = 300)
    public String nomeCompleto;
    public String endereco;
    public String cidade;
    public String uf;
    public String ativo;
    @Column(name = "data_cadastro")
    public String datacadastro;
    public String cep;
    public String email;
}
