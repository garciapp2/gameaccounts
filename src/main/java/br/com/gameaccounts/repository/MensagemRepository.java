package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
} 