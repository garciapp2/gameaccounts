package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Mensagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String texto;

    @ManyToOne
    private Usuario remetente;

    @ManyToOne
    private Usuario destinatario;

    public Mensagem() {}

    public Mensagem(String texto, Usuario remetente, Usuario destinatario) {
        this.texto = texto;
        this.remetente = remetente;
        this.destinatario = destinatario;
    }

    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }

    public Usuario getRemetente() {
        return remetente;
    }

    public Usuario getDestinatario() {
        return destinatario;
    }
}
