package br.com.gameaccounts.service;

import br.com.gameaccounts.model.ContaJogo;
import br.com.gameaccounts.repository.ContaJogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContaJogoService {
    @Autowired
    private ContaJogoRepository repository;

    public List<ContaJogo> listarContasJogo() {
        return repository.findAll();
    }
    
    public Page<ContaJogo> listarContasJogoPaginadas(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<ContaJogo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ContaJogo cadastrarContaJogo(ContaJogo contaJogo) {
        return repository.save(contaJogo);
    }
    
    public ContaJogo atualizarContaJogo(Long id, ContaJogo contaJogo) {
        if (repository.existsById(id)) {
            contaJogo.setId(id);
            return repository.save(contaJogo);
        }
        return null;
    }

    public void deletarContaJogo(Long id) {
        repository.deleteById(id);
    }
} 