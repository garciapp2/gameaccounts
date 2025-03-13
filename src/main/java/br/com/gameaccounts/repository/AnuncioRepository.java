package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
}
