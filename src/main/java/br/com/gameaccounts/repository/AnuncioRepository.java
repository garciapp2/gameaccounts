package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Anuncio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long>, JpaSpecificationExecutor<Anuncio> {
    Page<Anuncio> findByDescricaoContainingIgnoreCase(String descricao, Pageable pageable);
    Page<Anuncio> findByPrecoLessThanEqual(Double precoMaximo, Pageable pageable);
    Page<Anuncio> findByPrecoGreaterThanEqual(Double precoMinimo, Pageable pageable);
}
