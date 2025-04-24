package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.Anuncio;
import br.com.gameaccounts.service.AnuncioService;
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
@RequestMapping("/anuncios")
public class AnuncioController {
    @Autowired
    private AnuncioService service;

    @GetMapping
    public List<Anuncio> listarAnuncios() {
        return service.listarAnuncios();
    }
    
    @GetMapping("/paginados")
    public Page<Anuncio> listarAnunciosPaginados(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "preco") String sort,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return service.listarAnunciosPaginados(pageable);
    }
    
    @GetMapping("/busca/descricao")
    public Page<Anuncio> buscarPorDescricao(
            @RequestParam(value = "descricao") String descricao,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.buscarPorDescricao(descricao, pageable);
    }
    
    @GetMapping("/busca/precoMaximo")
    public Page<Anuncio> buscarPorPrecoMaximo(
            @RequestParam(value = "precoMax") Double precoMax,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.buscarPorPrecoMaximo(precoMax, pageable);
    }
    
    @GetMapping("/busca/precoMinimo")
    public Page<Anuncio> buscarPorPrecoMinimo(
            @RequestParam(value = "precoMin") Double precoMin,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.buscarPorPrecoMinimo(precoMin, pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Anuncio> buscarPorId(@PathVariable Long id) {
        Optional<Anuncio> anuncio = service.buscarPorId(id);
        return anuncio.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Anuncio cadastrarAnuncio(@RequestBody Anuncio anuncio) {
        return service.cadastrarAnuncio(anuncio);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Anuncio> atualizarAnuncio(@PathVariable Long id, @RequestBody Anuncio anuncio) {
        Anuncio anuncioAtualizado = service.atualizarAnuncio(id, anuncio);
        return anuncioAtualizado != null ? 
                ResponseEntity.ok(anuncioAtualizado) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarAnuncio(@PathVariable Long id) {
        service.deletarAnuncio(id);
    }
}
