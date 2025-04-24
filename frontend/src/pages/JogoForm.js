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
  InputAdornment
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import jogoService from '../services/jogoService';
import LoadingCircle from '../components/LoadingCircle';

const initialState = {
  nome: '',
  plataforma: '',
  preco: '',
  descricao: ''
};

const plataformas = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'Mobile',
  'Multiplataforma'
];

const JogoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = !!id;

  // Estados
  const [jogo, setJogo] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar jogo se estiver editando
  useEffect(() => {
    if (isEditing) {
      const fetchJogo = async () => {
        try {
          setLoading(true);
          const data = await jogoService.buscarPorId(id);
          setJogo({
            ...data,
            preco: data.preco?.toString() || ''
          });
        } catch (error) {
          enqueueSnackbar('Erro ao carregar jogo', { variant: 'error' });
          console.error('Erro ao buscar jogo:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJogo();
    }
  }, [id, isEditing, enqueueSnackbar]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJogo((prev) => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!jogo.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!jogo.plataforma.trim()) {
      newErrors.plataforma = 'Plataforma é obrigatória';
    }
    
    if (!jogo.preco) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(jogo.preco) || parseFloat(jogo.preco) < 0) {
      newErrors.preco = 'Preço deve ser um número positivo';
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
      
      const jogoData = {
        ...jogo,
        preco: parseFloat(jogo.preco)
      };
      
      console.log('Dados do jogo a serem enviados:', jogoData);
      
      if (isEditing) {
        console.log(`Atualizando jogo com ID ${id}:`, jogoData);
        await jogoService.atualizar(id, jogoData);
        message = 'Jogo atualizado com sucesso';
      } else {
        console.log('Criando novo jogo:', jogoData);
        const novoJogo = await jogoService.adicionar(jogoData);
        console.log('Jogo criado com sucesso:', novoJogo);
        message = 'Jogo criado com sucesso';
      }
      
      enqueueSnackbar(message, { variant: 'success' });
      navigate('/jogos');
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      enqueueSnackbar(
        isEditing ? 'Erro ao atualizar jogo' : 'Erro ao criar jogo', 
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/jogos');
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {isEditing ? 'Editar Jogo' : 'Novo Jogo'}
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="nome"
                  label="Nome do Jogo"
                  value={jogo.nome}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.plataforma}>
                  <InputLabel id="plataforma-label">Plataforma</InputLabel>
                  <Select
                    labelId="plataforma-label"
                    name="plataforma"
                    value={jogo.plataforma}
                    onChange={handleChange}
                    label="Plataforma"
                  >
                    {plataformas.map((plat) => (
                      <MenuItem key={plat} value={plat}>{plat}</MenuItem>
                    ))}
                  </Select>
                  {errors.plataforma && (
                    <Typography variant="caption" color="error">
                      {errors.plataforma}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="preco"
                  label="Preço"
                  type="number"
                  value={jogo.preco}
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
              
              <Grid item xs={12}>
                <TextField
                  name="descricao"
                  label="Descrição"
                  value={jogo.descricao || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
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
                startIcon={saving && <CircularProgress size={20} color="inherit" />}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JogoForm; 