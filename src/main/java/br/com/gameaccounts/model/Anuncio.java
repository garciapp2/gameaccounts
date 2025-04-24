package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private double preco;

    @ManyToOne
    private Usuario usuario;

    public Anuncio() {}

    public Anuncio(String descricao, double preco, Usuario usuario) {
        this.descricao = descricao;
        this.preco = preco;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public double getPreco() {
        return preco;
    }

    public Usuario getUsuario() {
        return usuario;
    }
}
