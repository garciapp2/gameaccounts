package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Jogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String genero;

    public Jogo() {}

    public Jogo(String nome, String genero) {
        this.nome = nome;
        this.genero = genero;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getGenero() {
        return genero;
    }
}
