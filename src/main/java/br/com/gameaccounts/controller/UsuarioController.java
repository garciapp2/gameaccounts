package br.com.gameaccounts.controller;

import br.com.gameaccounts.model.Usuario;
import br.com.gameaccounts.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return service.listarUsuarios();
    }

    @PostMapping
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario) {
        return service.cadastrarUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        service.deletarUsuario(id);
    }
}
