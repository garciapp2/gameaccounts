import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia,
  Grid, 
  Typography,
  Paper
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import LoadingCircle from '../components/LoadingCircle';

// Serviços
import usuarioService from '../services/usuarioService';
import anuncioService from '../services/anuncioService';
import jogoService from '../services/jogoService';
import contaJogoService from '../services/contaJogoService';
import transacaoService from '../services/transacaoService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    usuarios: 0,
    anuncios: 0,
    jogos: 0,
    contas: 0,
    transacoes: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Buscar dados das entidades
        const usuarios = await usuarioService.listarTodos();
        const anuncios = await anuncioService.listarTodos();
        const jogos = await jogoService.listarTodos();
        const contas = await contaJogoService.listarTodos();
        const transacoes = await transacaoService.listarTodos();
        
        // Atualizar contadores
        setCounts({
          usuarios: usuarios.length,
          anuncios: anuncios.length,
          jogos: jogos.length,
          contas: contas.length,
          transacoes: transacoes.length
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: 'Usuários',
      count: counts.usuarios,
      image: 'https://source.unsplash.com/random/300x200/?users',
      path: '/usuarios',
      color: '#4caf50'
    },
    {
      title: 'Anúncios',
      count: counts.anuncios,
      image: 'https://source.unsplash.com/random/300x200/?ads',
      path: '/anuncios',
      color: '#f44336'
    },
    {
      title: 'Jogos',
      count: counts.jogos,
      image: 'https://source.unsplash.com/random/300x200/?games',
      path: '/jogos',
      color: '#2196f3'
    },
    {
      title: 'Contas de Jogos',
      count: counts.contas,
      image: 'https://source.unsplash.com/random/300x200/?accounts',
      path: '/contas',
      color: '#ff9800'
    },
    {
      title: 'Transações',
      count: counts.transacoes,
      image: 'https://source.unsplash.com/random/300x200/?money',
      path: '/transacoes',
      color: '#9c27b0'
    }
  ];

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader title="Dashboard" showButton={false} />
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
        Bem-vindo ao Game Accounts Marketplace
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          Este é o sistema de gerenciamento do marketplace de contas de jogos.
          Utilize o menu lateral para navegar entre as diferentes funcionalidades.
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Resumo
      </Typography>
      
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardActionArea onClick={() => navigate(card.path)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={card.image}
                  alt={card.title}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography gutterBottom variant="h6" component="div">
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: card.color
                      }}
                    >
                      {card.count}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 