package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Anuncio anuncio;

    @OneToOne
    private Pagamento pagamento;

    public Transacao() {}

    public Transacao(Anuncio anuncio, Pagamento pagamento) {
        this.anuncio = anuncio;
        this.pagamento = pagamento;
    }

    public Long getId() {
        return id;
    }

    public Anuncio getAnuncio() {
        return anuncio;
    }

    public Pagamento getPagamento() {
        return pagamento;
    }
}
