import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import contaJogoService from '../services/contaJogoService';
import usuarioService from '../services/usuarioService';
import jogoService from '../services/jogoService';

function ContaJogoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [formValues, setFormValues] = useState({
    id: '',
    usuarioId: '',
    jogoId: '',
    nomePersonagem: '',
    nivel: 1,
    saldo: 0
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const isEdicao = !!id;

  useEffect(() => {
    const carregarDados = async () => {
      setInitialLoading(true);
      try {
        // Carregar listas de usuários e jogos
        const [usuariosData, jogosData] = await Promise.all([
          usuarioService.listar(),
          jogoService.listar()
        ]);
        
        console.log('Usuários carregados:', usuariosData);
        console.log('Jogos carregados:', jogosData);
        
        setUsuarios(usuariosData);
        setJogos(jogosData);

        // Se for edição, carrega os dados da conta
        if (isEdicao) {
          const contaJogo = await contaJogoService.buscarPorId(id);
          console.log('Conta de jogo carregada:', contaJogo);
          setFormValues({
            id: contaJogo.id,
            usuarioId: contaJogo.usuario?.id || '',
            jogoId: contaJogo.jogo?.id || '',
            nomePersonagem: contaJogo.nomePersonagem || '',
            nivel: contaJogo.nivel || 1,
            saldo: contaJogo.saldo || 0
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar dados. Tente novamente mais tarde.',
          severity: 'error'
        });
      } finally {
        setInitialLoading(false);
      }
    };

    carregarDados();
  }, [id, isEdicao]);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formValues.usuarioId) novosErros.usuarioId = 'Selecione um usuário';
    if (!formValues.jogoId) novosErros.jogoId = 'Selecione um jogo';
    if (!formValues.nomePersonagem) novosErros.nomePersonagem = 'Nome do personagem é obrigatório';
    if (formValues.nivel <= 0) novosErros.nivel = 'Nível deve ser maior que zero';
    if (formValues.saldo < 0) novosErros.saldo = 'Saldo não pode ser negativo';

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'nivel' || name === 'saldo' ? Number(value) : value
    });

    // Limpa erro do campo quando ele é modificado
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      // Preparar objeto para envio
      const contaJogoData = {
        ...formValues,
        usuario: { id: formValues.usuarioId },
        jogo: { id: formValues.jogoId }
      };

      delete contaJogoData.usuarioId;
      delete contaJogoData.jogoId;

      // Se for edição, atualiza. Caso contrário, adiciona
      if (isEdicao) {
        await contaJogoService.atualizar(id, contaJogoData);
        setSnackbar({
          open: true,
          message: 'Conta de jogo atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        await contaJogoService.adicionar(contaJogoData);
        setSnackbar({
          open: true,
          message: 'Conta de jogo criada com sucesso!',
          severity: 'success'
        });
      }

      // Redireciona após um curto período
      setTimeout(() => {
        navigate('/contas-jogo');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar conta de jogo:', error);
      setSnackbar({
        open: true,
        message: `Erro ao ${isEdicao ? 'atualizar' : 'criar'} conta de jogo`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/contas-jogo');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {isEdicao ? 'Editar Conta de Jogo' : 'Nova Conta de Jogo'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleVoltar}
          >
            Voltar
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.usuarioId}>
                <InputLabel id="usuario-label">Usuário</InputLabel>
                <Select
                  labelId="usuario-label"
                  name="usuarioId"
                  value={formValues.usuarioId}
                  onChange={handleChange}
                  label="Usuário"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Selecione um usuário</em>
                  </MenuItem>
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.usuarioId && (
                  <Typography variant="caption" color="error">
                    {errors.usuarioId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.jogoId}>
                <InputLabel id="jogo-label">Jogo</InputLabel>
                <Select
                  labelId="jogo-label"
                  name="jogoId"
                  value={formValues.jogoId}
                  onChange={handleChange}
                  label="Jogo"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Selecione um jogo</em>
                  </MenuItem>
                  {jogos.map((jogo) => (
                    <MenuItem key={jogo.id} value={jogo.id}>
                      {jogo.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.jogoId && (
                  <Typography variant="caption" color="error">
                    {errors.jogoId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Personagem"
                name="nomePersonagem"
                value={formValues.nomePersonagem}
                onChange={handleChange}
                error={!!errors.nomePersonagem}
                helperText={errors.nomePersonagem}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nível"
                name="nivel"
                type="number"
                value={formValues.nivel}
                onChange={handleChange}
                error={!!errors.nivel}
                helperText={errors.nivel}
                inputProps={{ min: 1 }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Saldo"
                name="saldo"
                type="number"
                value={formValues.saldo}
                onChange={handleChange}
                error={!!errors.saldo}
                helperText={errors.saldo}
                inputProps={{ step: 0.01, min: 0 }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ContaJogoForm; 