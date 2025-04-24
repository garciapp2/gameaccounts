package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.Jogo;
import br.com.gameaccounts.service.JogoService;
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
@RequestMapping("/jogos")
public class JogoController {
    @Autowired
    private JogoService service;

    @GetMapping
    public List<Jogo> listarJogos() {
        return service.listarJogos();
    }
    
    @GetMapping("/paginados")
    public Page<Jogo> listarJogosPaginados(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "nome") String sort,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return service.listarJogosPaginados(pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Jogo> buscarPorId(@PathVariable Long id) {
        Optional<Jogo> jogo = service.buscarPorId(id);
        return jogo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Jogo cadastrarJogo(@RequestBody Jogo jogo) {
        return service.cadastrarJogo(jogo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Jogo> atualizarJogo(@PathVariable Long id, @RequestBody Jogo jogo) {
        Jogo jogoAtualizado = service.atualizarJogo(id, jogo);
        return jogoAtualizado != null ? 
                ResponseEntity.ok(jogoAtualizado) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarJogo(@PathVariable Long id) {
        service.deletarJogo(id);
    }
} 