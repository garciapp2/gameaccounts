import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import anuncioService from '../services/anuncioService';
import usuarioService from '../services/usuarioService';
import jogoService from '../services/jogoService';
import contaJogoService from '../services/contaJogoService';
import LoadingCircle from '../components/LoadingCircle';

const initialState = {
  descricao: '',
  preco: '',
  disponivel: true,
  usuarioId: '',
  jogoId: '',
  contaJogoId: ''
};

const AnuncioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = !!id;

  // Estados
  const [anuncio, setAnuncio] = useState(initialState);
  const [usuarios, setUsuarios] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [contasJogo, setContasJogo] = useState([]);
  const [contasJogoFiltradas, setContasJogoFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Carregar usuários, jogos e contas de jogo
        const [usuariosData, jogosData, contasJogoData] = await Promise.all([
          usuarioService.listar(),
          jogoService.listar(),
          contaJogoService.listar()
        ]);
        
        setUsuarios(usuariosData);
        setJogos(jogosData);
        setContasJogo(contasJogoData);
        
        // Carregar anúncio se estiver editando
        if (isEditing) {
          const data = await anuncioService.buscarPorId(id);
          
          if (!data) {
            enqueueSnackbar('Anúncio não encontrado', { variant: 'error' });
            navigate('/anuncios');
            return;
          }
          
          setAnuncio({
            descricao: data.descricao || '',
            preco: data.preco?.toString() || '',
            disponivel: data.disponivel ?? true,
            usuarioId: data.usuario?.id || '',
            jogoId: data.jogo?.id || '',
            contaJogoId: data.contaJogo?.id || ''
          });          
          
          // Filtrar contas de jogo pelo usuário e jogo selecionados
          if (data.usuario?.id && data.jogo?.id) {
            filtrarContasJogo(data.usuario.id, data.jogo.id);
          }
        }
      } catch (error) {
        enqueueSnackbar('Erro ao carregar dados', { variant: 'error' });
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditing, enqueueSnackbar]);

  // Filtrar contas de jogo por usuário e jogo
  const filtrarContasJogo = (usuarioId, jogoId) => {
    if (!usuarioId || !jogoId) {
      setContasJogoFiltradas([]);
      return;
    }
    
    const contas = contasJogo.filter(
      conta => conta.usuario?.id === usuarioId && conta.jogo?.id === jogoId
    );
    
    setContasJogoFiltradas(contas);
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'usuarioId' || name === 'jogoId') {
      setAnuncio(prev => {
        const updatedAnuncio = { 
          ...prev, 
          [name]: value,
          // Limpar a conta de jogo se o usuário ou jogo mudar
          contaJogoId: '' 
        };
        
        // Atualizar as contas de jogo filtradas
        if (name === 'usuarioId') {
          filtrarContasJogo(value, updatedAnuncio.jogoId);
        } else if (name === 'jogoId') {
          filtrarContasJogo(updatedAnuncio.usuarioId, value);
        }
        
        return updatedAnuncio;
      });
    } else {
      setAnuncio(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!anuncio.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!anuncio.preco) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(anuncio.preco) || parseFloat(anuncio.preco) <= 0) {
      newErrors.preco = 'Preço deve ser um número positivo';
    }
    
    if (!anuncio.usuarioId) {
      newErrors.usuarioId = 'Usuário é obrigatório';
    }
    
    if (!anuncio.jogoId) {
      newErrors.jogoId = 'Jogo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setSaving(true);
      let message;
      
      const anuncioData = {
        ...anuncio,
        preco: parseFloat(anuncio.preco),
        usuario: { id: anuncio.usuarioId },
        jogo: { id: anuncio.jogoId },
        contaJogo: anuncio.contaJogoId ? { id: anuncio.contaJogoId } : null
      };
      
      // Remover os campos auxiliares
      delete anuncioData.usuarioId;
      delete anuncioData.jogoId;
      delete anuncioData.contaJogoId;
      
      if (isEditing) {
        await anuncioService.atualizar(id, anuncioData);
        message = 'Anúncio atualizado com sucesso';
      } else {
        await anuncioService.adicionar(anuncioData);
        message = 'Anúncio criado com sucesso';
      }
      
      enqueueSnackbar(message, { variant: 'success' });
      navigate('/anuncios');
    } catch (error) {
      enqueueSnackbar(
        isEditing ? 'Erro ao atualizar anúncio' : 'Erro ao criar anúncio', 
        { variant: 'error' }
      );
      console.error('Erro ao salvar anúncio:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/anuncios');
  };

  if (initialLoading) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {isEditing ? 'Editar Anúncio' : 'Novo Anúncio'}
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="descricao"
                  label="Descrição"
                  value={anuncio.descricao}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.descricao}
                  helperText={errors.descricao}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="preco"
                  label="Preço"
                  type="number"
                  value={anuncio.preco}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.preco}
                  helperText={errors.preco}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputProps: { step: "0.01", min: "0" }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="disponivel-label">Disponível</InputLabel>
                  <Select
                    labelId="disponivel-label"
                    name="disponivel"
                    value={anuncio.disponivel}
                    onChange={handleChange}
                    label="Disponível"
                  >
                    <MenuItem value={true}>Sim</MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.usuarioId}>
                  <InputLabel id="usuario-label">Usuário</InputLabel>
                  <Select
                    labelId="usuario-label"
                    name="usuarioId"
                    value={anuncio.usuarioId}
                    onChange={handleChange}
                    label="Usuário"
                  >
                    {usuarios.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>{usuario.nome}</MenuItem>
                    ))}
                  </Select>
                  {errors.usuarioId && (
                    <FormHelperText>{errors.usuarioId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.jogoId}>
                  <InputLabel id="jogo-label">Jogo</InputLabel>
                  <Select
                    labelId="jogo-label"
                    name="jogoId"
                    value={anuncio.jogoId}
                    onChange={handleChange}
                    label="Jogo"
                  >
                    {jogos.map((jogo) => (
                      <MenuItem key={jogo.id} value={jogo.id}>{jogo.nome}</MenuItem>
                    ))}
                  </Select>
                  {errors.jogoId && (
                    <FormHelperText>{errors.jogoId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!anuncio.usuarioId || !anuncio.jogoId || contasJogoFiltradas.length === 0}>
                  <InputLabel id="conta-jogo-label">Conta de Jogo (Opcional)</InputLabel>
                  <Select
                    labelId="conta-jogo-label"
                    name="contaJogoId"
                    value={anuncio.contaJogoId}
                    onChange={handleChange}
                    label="Conta de Jogo (Opcional)"
                  >
                    <MenuItem value="">
                      <em>Nenhuma</em>
                    </MenuItem>
                    {contasJogoFiltradas.map((conta) => (
                      <MenuItem key={conta.id} value={conta.id}>
                        {conta.nomePersonagem} (Nível {conta.nivel})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {!anuncio.usuarioId || !anuncio.jogoId 
                      ? 'Selecione um usuário e um jogo primeiro' 
                      : contasJogoFiltradas.length === 0 
                        ? 'Não há contas de jogo disponíveis para este usuário e jogo' 
                        : 'Selecione uma conta de jogo (opcional)'}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{ position: 'relative' }}
              >
                {saving && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
                {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnuncioForm; 