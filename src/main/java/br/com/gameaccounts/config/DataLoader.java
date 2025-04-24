package br.com.gameaccounts.config;

import br.com.gameaccounts.model.*;
import br.com.gameaccounts.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            JogoRepository jogoRepository,
            ContaJogoRepository contaJogoRepository,
            AnuncioRepository anuncioRepository,
            TransacaoRepository transacaoRepository
    ) {
        return args -> {
            // Criar usuários
            Usuario usuario1 = new Usuario("João Silva", "joao@email.com", "senha123");
            Usuario usuario2 = new Usuario("Maria Santos", "maria@email.com", "senha456");
            Usuario usuario3 = new Usuario("Pedro Oliveira", "pedro@email.com", "senha789");
            
            usuarioRepository.save(usuario1);
            usuarioRepository.save(usuario2);
            usuarioRepository.save(usuario3);
            
            // Criar jogos
            Jogo jogo1 = new Jogo("League of Legends", "PC");
            Jogo jogo2 = new Jogo("Fortnite", "Multiplataforma");
            Jogo jogo3 = new Jogo("Valorant", "PC");
            Jogo jogo4 = new Jogo("Counter-Strike 2", "PC");
            
            jogoRepository.save(jogo1);
            jogoRepository.save(jogo2);
            jogoRepository.save(jogo3);
            jogoRepository.save(jogo4);
            
            // Criar contas de jogos
            ContaJogo conta1 = new ContaJogo("jogador123", "senha123", jogo1);
            ContaJogo conta2 = new ContaJogo("proGamer456", "senha456", jogo2);
            ContaJogo conta3 = new ContaJogo("gameMaster789", "senha789", jogo3);
            ContaJogo conta4 = new ContaJogo("topPlayer", "senha123", jogo4);
            
            contaJogoRepository.save(conta1);
            contaJogoRepository.save(conta2);
            contaJogoRepository.save(conta3);
            contaJogoRepository.save(conta4);
            
            // Criar anúncios
            Anuncio anuncio1 = new Anuncio("Conta LoL nível 100 com todas as skins", 150.0, usuario1);
            Anuncio anuncio2 = new Anuncio("Conta Fortnite com skins raras", 200.0, usuario2);
            Anuncio anuncio3 = new Anuncio("Conta Valorant com skins exclusivas", 120.0, usuario3);
            Anuncio anuncio4 = new Anuncio("Conta CS2 com facas raras", 300.0, usuario1);
            
            anuncioRepository.save(anuncio1);
            anuncioRepository.save(anuncio2);
            anuncioRepository.save(anuncio3);
            anuncioRepository.save(anuncio4);
            
            // Criar transações
            Transacao transacao1 = new Transacao(LocalDateTime.now().minusDays(5), 150.0, anuncio1);
            Transacao transacao2 = new Transacao(LocalDateTime.now().minusDays(3), 200.0, anuncio2);
            
            transacaoRepository.save(transacao1);
            transacaoRepository.save(transacao2);
        };
    }
} 