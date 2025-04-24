package br.com.gameaccounts.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime data;
    private double valor;

    @OneToOne
    private Anuncio anuncio;

    @OneToOne
    private Pagamento pagamento;

    public Transacao() {}

    public Transacao(LocalDateTime data, double valor, Anuncio anuncio) {
        this.data = data;
        this.valor = valor;
        this.anuncio = anuncio;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public double getValor() {
        return valor;
    }

    public Anuncio getAnuncio() {
        return anuncio;
    }

    public Pagamento getPagamento() {
        return pagamento;
    }
}
