package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class ContaJogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nickname;
    private int nivel;

    @ManyToOne
    private Usuario dono;

    public ContaJogo() {}

    public ContaJogo(String nickname, int nivel, Usuario dono) {
        this.nickname = nickname;
        this.nivel = nivel;
        this.dono = dono;
    }

    public Long getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }

    public int getNivel() {
        return nivel;
    }

    public Usuario getDono() {
        return dono;
    }
}
