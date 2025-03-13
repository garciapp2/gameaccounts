package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.Anuncio;
import br.com.gameaccounts.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anuncios")
public class AnuncioController {
    @Autowired
    private AnuncioService service;

    @GetMapping
    public List<Anuncio> listarAnuncios() {
        return service.listarAnuncios();
    }

    @PostMapping
    public Anuncio cadastrarAnuncio(@RequestBody Anuncio anuncio) {
        return service.cadastrarAnuncio(anuncio);
    }

    @DeleteMapping("/{id}")
    public void deletarAnuncio(@PathVariable Long id) {
        service.deletarAnuncio(id);
    }
}
