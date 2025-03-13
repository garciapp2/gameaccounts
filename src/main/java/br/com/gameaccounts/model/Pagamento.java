package br.com.gameaccounts.model;

import jakarta.persistence.*;

@Entity
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double valor;
    private String metodo; // exemplo: CARTAO, PIX, BOLETO

    public Pagamento() {}

    public Pagamento(double valor, String metodo) {
        this.valor = valor;
        this.metodo = metodo;
    }

    public Long getId() {
        return id;
    }

    public double getValor() {
        return valor;
    }

    public String getMetodo() {
        return metodo;
    }
}
