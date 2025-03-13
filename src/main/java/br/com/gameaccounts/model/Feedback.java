package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comentario;
    private int nota;

    @ManyToOne
    private Usuario usuario;

    public Feedback() {}

    public Feedback(String comentario, int nota, Usuario usuario) {
        this.comentario = comentario;
        this.nota = nota;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public String getComentario() {
        return comentario;
    }

    public int getNota() {
        return nota;
    }

    public Usuario getUsuario() {
        return usuario;
    }
}
