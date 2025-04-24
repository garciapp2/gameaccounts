package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.ContaJogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContaJogoRepository extends JpaRepository<ContaJogo, Long>, JpaSpecificationExecutor<ContaJogo> {
} 