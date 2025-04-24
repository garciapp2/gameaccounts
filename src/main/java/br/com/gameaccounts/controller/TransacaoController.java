package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.Transacao;
import br.com.gameaccounts.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {
    @Autowired
    private TransacaoService service;

    @GetMapping
    public List<Transacao> listarTransacoes() {
        return service.listarTransacoes();
    }
    
    @GetMapping("/paginados")
    public Page<Transacao> listarTransacoesPaginadas(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "data") String sort,
            @RequestParam(value = "direction", defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return service.listarTransacoesPaginadas(pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transacao> buscarPorId(@PathVariable Long id) {
        Optional<Transacao> transacao = service.buscarPorId(id);
        return transacao.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transacao cadastrarTransacao(@RequestBody Transacao transacao) {
        return service.cadastrarTransacao(transacao);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizarTransacao(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao transacaoAtualizada = service.atualizarTransacao(id, transacao);
        return transacaoAtualizada != null ? 
                ResponseEntity.ok(transacaoAtualizada) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarTransacao(@PathVariable Long id) {
        service.deletarTransacao(id);
    }
} 