import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Container,
  FormControl, 
  FormHelperText, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Snackbar, 
  TextField, 
  Typography 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import contaJogoService from '../services/contaJogoService';
import jogoService from '../services/jogoService';
import usuarioService from '../services/usuarioService';

const DetalheContaJogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = !!id;

  const [formData, setFormData] = useState({
    id: null,
    usuarioId: '',
    jogoId: '',
    nomePersonagem: '',
    nivel: 1,
    saldo: 0
  });

  const [usuarios, setUsuarios] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar listas de usuários e jogos
        const [usuariosData, jogosData] = await Promise.all([
          usuarioService.listar(),
          jogoService.listar()
        ]);
        
        setUsuarios(usuariosData);
        setJogos(jogosData);

        // Se for edição, carregar dados da conta de jogo
        if (isEdicao) {
          const contaJogo = await contaJogoService.buscarPorId(Number(id));
          setFormData({
            id: contaJogo.id,
            usuarioId: contaJogo.usuario.id,
            jogoId: contaJogo.jogo.id,
            nomePersonagem: contaJogo.nomePersonagem,
            nivel: contaJogo.nivel,
            saldo: contaJogo.saldo
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar dados. Tente novamente mais tarde.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, isEdicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validações específicas
    let valorFinal = value;
    
    if (name === 'nivel') {
      valorFinal = Math.max(1, Math.min(100, parseInt(value) || 1));
    } else if (name === 'saldo') {
      valorFinal = parseFloat(value) || 0;
    }
    
    setFormData({ ...formData, [name]: valorFinal });
    
    // Limpar erro do campo quando ele for alterado
    if (erros[name]) {
      setErros({ ...erros, [name]: null });
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.usuarioId) novosErros.usuarioId = 'Selecione um usuário';
    if (!formData.jogoId) novosErros.jogoId = 'Selecione um jogo';
    if (!formData.nomePersonagem.trim()) novosErros.nomePersonagem = 'Informe o nome do personagem';
    if (formData.nivel < 1 || formData.nivel > 100) novosErros.nivel = 'O nível deve estar entre 1 e 100';
    if (formData.saldo < 0) novosErros.saldo = 'O saldo não pode ser negativo';
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isEdicao) {
        await contaJogoService.atualizar(formData.id, formData);
        setSnackbar({
          open: true,
          message: 'Conta de jogo atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        await contaJogoService.adicionar(formData);
        setSnackbar({
          open: true,
          message: 'Conta de jogo criada com sucesso!',
          severity: 'success'
        });
      }
      
      setTimeout(() => {
        navigate('/contas-jogo');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar conta de jogo:', error);
      setSnackbar({
        open: true,
        message: `Erro ao ${isEdicao ? 'atualizar' : 'criar'} conta de jogo. Tente novamente mais tarde.`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/contas-jogo');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEdicao ? 'Editar Conta de Jogo' : 'Nova Conta de Jogo'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!erros.usuarioId}>
                <InputLabel id="usuario-label">Usuário</InputLabel>
                <Select
                  labelId="usuario-label"
                  id="usuarioId"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleChange}
                  label="Usuário"
                  disabled={loading}
                >
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </MenuItem>
                  ))}
                </Select>
                {erros.usuarioId && <FormHelperText>{erros.usuarioId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!erros.jogoId}>
                <InputLabel id="jogo-label">Jogo</InputLabel>
                <Select
                  labelId="jogo-label"
                  id="jogoId"
                  name="jogoId"
                  value={formData.jogoId}
                  onChange={handleChange}
                  label="Jogo"
                  disabled={loading}
                >
                  {jogos.map((jogo) => (
                    <MenuItem key={jogo.id} value={jogo.id}>
                      {jogo.nome}
                    </MenuItem>
                  ))}
                </Select>
                {erros.jogoId && <FormHelperText>{erros.jogoId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="nomePersonagem"
                name="nomePersonagem"
                label="Nome do Personagem"
                value={formData.nomePersonagem}
                onChange={handleChange}
                error={!!erros.nomePersonagem}
                helperText={erros.nomePersonagem}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nivel"
                name="nivel"
                label="Nível"
                type="number"
                value={formData.nivel}
                onChange={handleChange}
                inputProps={{ min: 1, max: 100 }}
                error={!!erros.nivel}
                helperText={erros.nivel}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="saldo"
                name="saldo"
                label="Saldo (R$)"
                type="number"
                value={formData.saldo}
                onChange={handleChange}
                inputProps={{ step: 0.01, min: 0 }}
                error={!!erros.saldo}
                helperText={erros.saldo}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {isEdicao ? 'Atualizar' : 'Criar'}
            </Button>
          </Box>
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

export default DetalheContaJogo; 