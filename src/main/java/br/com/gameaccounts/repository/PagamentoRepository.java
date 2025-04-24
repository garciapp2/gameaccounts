package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
} 