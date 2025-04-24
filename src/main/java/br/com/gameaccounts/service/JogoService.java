package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Jogo;
import br.com.gameaccounts.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JogoService {
    @Autowired
    private JogoRepository repository;

    public List<Jogo> listarJogos() {
        return repository.findAll();
    }
    
    public Page<Jogo> listarJogosPaginados(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<Jogo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Jogo cadastrarJogo(Jogo jogo) {
        return repository.save(jogo);
    }
    
    public Jogo atualizarJogo(Long id, Jogo jogo) {
        if (repository.existsById(id)) {
            jogo.setId(id);
            return repository.save(jogo);
        }
        return null;
    }

    public void deletarJogo(Long id) {
        repository.deleteById(id);
    }
} 