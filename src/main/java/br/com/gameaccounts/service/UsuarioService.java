package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Usuario;
import br.com.gameaccounts.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> listarUsuarios() {
        return repository.findAll();
    }

    public Usuario cadastrarUsuario(Usuario usuario) {
        return repository.save(usuario);
    }

    public void deletarUsuario(Long id) {
        repository.deleteById(id);
    }
}
