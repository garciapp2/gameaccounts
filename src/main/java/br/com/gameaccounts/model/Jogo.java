package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Jogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String plataforma;

    public Jogo() {}

    public Jogo(String nome, String plataforma) {
        this.nome = nome;
        this.plataforma = plataforma;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public String getPlataforma() {
        return plataforma;
    }
}
