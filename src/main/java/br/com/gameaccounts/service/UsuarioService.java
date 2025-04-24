package br.com.gameaccounts.service;

import br.com.gameaccounts.model.Usuario;
import br.com.gameaccounts.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> listarUsuarios() {
        return repository.findAll();
    }
    
    public Page<Usuario> listarUsuariosPaginados(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<Usuario> buscarPorNome(String nome, Pageable pageable) {
        return repository.findByNomeContainingIgnoreCase(nome, pageable);
    }
    
    public Page<Usuario> buscarPorEmail(String email, Pageable pageable) {
        return repository.findByEmailContainingIgnoreCase(email, pageable);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Usuario cadastrarUsuario(Usuario usuario) {
        return repository.save(usuario);
    }
    
    public Usuario atualizarUsuario(Long id, Usuario usuario) {
        if (repository.existsById(id)) {
            usuario.setId(id);
            return repository.save(usuario);
        }
        return null;
    }

    public void deletarUsuario(Long id) {
        repository.deleteById(id);
    }
}
