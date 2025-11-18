package br.com.setrem.avaliacao.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase; // Mude para PanacheEntityBase
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipamentos")
public class Equipamento extends PanacheEntityBase { // Mude aqui

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Adicione esta linha!
    public Long id; // Deixe o 'id' público ou crie getter/setter

    private String codigo;

    @Column(name = "numero_serie")
    private String numeroSerie;

    private String usuario;

    @Column(name = "data_validacao")
    private LocalDate dataValidacao;

    @ManyToOne
    @JoinColumn(name = "setor_id")
    private Setor setor;

    // Getters e Setters
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public LocalDate getDataValidacao() {
        return dataValidacao;
    }

    public void setDataValidacao(LocalDate dataValidacao) {
        this.dataValidacao = dataValidacao;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }
}