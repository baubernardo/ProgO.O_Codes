package br.com.setrem.avaliacao.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase; // Mude para PanacheEntityBase
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "setor")
public class Setor extends PanacheEntityBase { // Mude aqui

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Adicione esta linha!
    public Long id; // Deixe o 'id' público ou crie getter/setter

    private String nome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}