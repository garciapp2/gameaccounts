import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import jogoService from '../services/jogoService';
import contaJogoService from '../services/contaJogoService';

const DetalheJogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jogo, setJogo] = useState(null);
  const [contasJogo, setContasJogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar dados do jogo
        const jogoData = await jogoService.buscarPorId(id);
        setJogo(jogoData);

        // Carregar contas associadas a este jogo
        const contasDoJogo = await contaJogoService.buscarPorJogo(id);
        setContasJogo(contasDoJogo);
      } catch (error) {
        console.error('Erro ao carregar dados do jogo:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar dados do jogo. Tente novamente mais tarde.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarDados();
    }
  }, [id]);

  const handleVoltar = () => {
    navigate('/jogos');
  };

  const handleEditar = () => {
    navigate(`/jogos/editar/${id}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!jogo) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom color="error">
            Jogo não encontrado
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleVoltar}
            sx={{ mt: 2 }}
          >
            Voltar para Jogos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {jogo.nome}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleVoltar}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditar}
            >
              Editar
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" component="div" gutterBottom>
              <strong>Categoria:</strong> {jogo.categoria}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" component="div" gutterBottom>
              <strong>Preço:</strong> {formatarPreco(jogo.preco)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="div" gutterBottom>
              <strong>Descrição:</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {jogo.descricao}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Contas de Jogo Associadas ({contasJogo.length})
          </Typography>
          
          {contasJogo.length > 0 ? (
            <Grid container spacing={2}>
              {contasJogo.map(conta => (
                <Grid item xs={12} md={6} key={conta.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {conta.nomePersonagem}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Usuário: {conta.usuario.nome}
                      </Typography>
                      <Typography variant="body2">
                        Nível: {conta.nivel}
                      </Typography>
                      <Typography variant="body2">
                        Saldo: {formatarPreco(conta.saldo)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Nenhuma conta de jogo encontrada para este jogo.
            </Typography>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DetalheJogo; 