package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Transacao;
import br.com.gameaccounts.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransacaoService {
    @Autowired
    private TransacaoRepository repository;

    public List<Transacao> listarTransacoes() {
        return repository.findAll();
    }
    
    public Page<Transacao> listarTransacoesPaginadas(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<Transacao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Transacao cadastrarTransacao(Transacao transacao) {
        return repository.save(transacao);
    }
    
    public Transacao atualizarTransacao(Long id, Transacao transacao) {
        if (repository.existsById(id)) {
            transacao.setId(id);
            return repository.save(transacao);
        }
        return null;
    }

    public void deletarTransacao(Long id) {
        repository.deleteById(id);
    }
} 