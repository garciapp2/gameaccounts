package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
