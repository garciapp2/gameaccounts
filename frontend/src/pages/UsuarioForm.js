import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import usuarioService from '../services/usuarioService';
import LoadingCircle from '../components/LoadingCircle';

const initialState = {
  nome: '',
  email: '',
  senha: ''
};

const UsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = !!id;

  // Estados
  const [usuario, setUsuario] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Carregar usuário se estiver editando
  useEffect(() => {
    if (isEditing) {
      const fetchUsuario = async () => {
        try {
          setLoading(true);
          const data = await usuarioService.buscarPorId(id);
          // Não exibimos a senha ao editar
          setUsuario({ ...data, senha: '' });
        } catch (error) {
          enqueueSnackbar('Erro ao carregar usuário', { variant: 'error' });
          console.error('Erro ao buscar usuário:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsuario();
    }
  }, [id, isEditing, enqueueSnackbar]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!usuario.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!usuario.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!isEditing && !usuario.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória para novos usuários';
    } else if (!isEditing && usuario.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
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
      
      if (isEditing) {
        await usuarioService.atualizar(id, usuario);
        message = 'Usuário atualizado com sucesso';
      } else {
        await usuarioService.criar(usuario);
        message = 'Usuário criado com sucesso';
      }
      
      enqueueSnackbar(message, { variant: 'success' });
      navigate('/usuarios');
    } catch (error) {
      enqueueSnackbar(
        isEditing ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário', 
        { variant: 'error' }
      );
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
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
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="nome"
                  label="Nome"
                  value={usuario.nome}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={usuario.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="senha"
                  label={isEditing ? "Nova Senha (deixe em branco para não alterar)" : "Senha"}
                  type={showPassword ? 'text' : 'password'}
                  value={usuario.senha}
                  onChange={handleChange}
                  fullWidth
                  required={!isEditing}
                  error={!!errors.senha}
                  helperText={errors.senha}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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

export default UsuarioForm; 