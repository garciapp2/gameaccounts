package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Anuncio;
import br.com.gameaccounts.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnuncioService {
    @Autowired
    private AnuncioRepository repository;

    public List<Anuncio> listarAnuncios() {
        return repository.findAll();
    }

    public Anuncio cadastrarAnuncio(Anuncio anuncio) {
        return repository.save(anuncio);
    }

    public void deletarAnuncio(Long id) {
        repository.deleteById(id);
    }
}
