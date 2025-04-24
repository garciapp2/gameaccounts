package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.ContaJogo;
import br.com.gameaccounts.service.ContaJogoService;
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
@RequestMapping("/contas")
public class ContaJogoController {
    @Autowired
    private ContaJogoService service;

    @GetMapping
    public List<ContaJogo> listarContasJogo() {
        return service.listarContasJogo();
    }
    
    @GetMapping("/paginados")
    public Page<ContaJogo> listarContasJogoPaginadas(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "login") String sort,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return service.listarContasJogoPaginadas(pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContaJogo> buscarPorId(@PathVariable Long id) {
        Optional<ContaJogo> contaJogo = service.buscarPorId(id);
        return contaJogo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContaJogo cadastrarContaJogo(@RequestBody ContaJogo contaJogo) {
        return service.cadastrarContaJogo(contaJogo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ContaJogo> atualizarContaJogo(@PathVariable Long id, @RequestBody ContaJogo contaJogo) {
        ContaJogo contaJogoAtualizada = service.atualizarContaJogo(id, contaJogo);
        return contaJogoAtualizada != null ? 
                ResponseEntity.ok(contaJogoAtualizada) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarContaJogo(@PathVariable Long id) {
        service.deletarContaJogo(id);
    }
} 