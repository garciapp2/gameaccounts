package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class ContaJogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String senha;

    @ManyToOne
    private Jogo jogo;

    public ContaJogo() {}

    public ContaJogo(String login, String senha, Jogo jogo) {
        this.login = login;
        this.senha = senha;
        this.jogo = jogo;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public String getSenha() {
        return senha;
    }

    public Jogo getJogo() {
        return jogo;
    }
}
