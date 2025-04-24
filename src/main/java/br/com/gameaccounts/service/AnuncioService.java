package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Anuncio;
import br.com.gameaccounts.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnuncioService {
    @Autowired
    private AnuncioRepository repository;

    public List<Anuncio> listarAnuncios() {
        return repository.findAll();
    }
    
    public Page<Anuncio> listarAnunciosPaginados(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<Anuncio> buscarPorDescricao(String descricao, Pageable pageable) {
        return repository.findByDescricaoContainingIgnoreCase(descricao, pageable);
    }
    
    public Page<Anuncio> buscarPorPrecoMaximo(Double precoMaximo, Pageable pageable) {
        return repository.findByPrecoLessThanEqual(precoMaximo, pageable);
    }
    
    public Page<Anuncio> buscarPorPrecoMinimo(Double precoMinimo, Pageable pageable) {
        return repository.findByPrecoGreaterThanEqual(precoMinimo, pageable);
    }

    public Optional<Anuncio> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Anuncio cadastrarAnuncio(Anuncio anuncio) {
        return repository.save(anuncio);
    }
    
    public Anuncio atualizarAnuncio(Long id, Anuncio anuncio) {
        if (repository.existsById(id)) {
            anuncio.setId(id);
            return repository.save(anuncio);
        }
        return null;
    }

    public void deletarAnuncio(Long id) {
        repository.deleteById(id);
    }
}
