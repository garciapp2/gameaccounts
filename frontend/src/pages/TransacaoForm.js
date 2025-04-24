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
import transacaoService from '../services/transacaoService';
import usuarioService from '../services/usuarioService';
import contaJogoService from '../services/contaJogoService';
import LoadingCircle from '../components/LoadingCircle';

const initialState = {
  descricao: '',
  valor: '',
  data: new Date().toISOString().substring(0, 16), // Formato "yyyy-MM-ddThh:mm"
  tipo: '',
  status: 'PENDENTE',
  usuarioId: '',
  contaJogoId: ''
};

const tipos = [
  'DEPOSITO',
  'SAQUE',
  'TRANSFERENCIA',
  'COMPRA',
  'VENDA'
];

const status = [
  'PENDENTE',
  'PROCESSANDO',
  'CONCLUIDA',
  'CANCELADA',
  'REEMBOLSADA'
];

const TransacaoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = !!id;

  // Estados
  const [transacao, setTransacao] = useState(initialState);
  const [usuarios, setUsuarios] = useState([]);
  const [contasJogo, setContasJogo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Carregar usuários e contas de jogo
        const [usuariosData, contasJogoData] = await Promise.all([
          usuarioService.listar(),
          contaJogoService.listar()
        ]);
        
        setUsuarios(usuariosData);
        setContasJogo(contasJogoData);
        
        // Carregar transação se estiver editando
        if (isEditing) {
          const data = await transacaoService.buscarPorId(id);
          
          // Formatar a data para o campo datetime-local
          let formattedData = data.data;
          if (formattedData) {
            const dataObj = new Date(formattedData);
            formattedData = dataObj.toISOString().substring(0, 16); // "YYYY-MM-DDTHH:MM"
          }
          
          setTransacao({
            ...data,
            data: formattedData,
            usuarioId: data.usuario?.id || '',
            contaJogoId: data.contaJogo?.id || '',
            valor: data.valor?.toString() || ''
          });
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

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransacao((prev) => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!transacao.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!transacao.valor) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(transacao.valor) || parseFloat(transacao.valor) <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }
    
    if (!transacao.data) {
      newErrors.data = 'Data é obrigatória';
    }
    
    if (!transacao.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }
    
    if (!transacao.status) {
      newErrors.status = 'Status é obrigatório';
    }
    
    if (!transacao.usuarioId) {
      newErrors.usuarioId = 'Usuário é obrigatório';
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
      
      const transacaoData = {
        ...transacao,
        valor: parseFloat(transacao.valor),
        usuario: { id: transacao.usuarioId },
        contaJogo: transacao.contaJogoId ? { id: transacao.contaJogoId } : null
      };
      
      // Remover os campos auxiliares
      delete transacaoData.usuarioId;
      delete transacaoData.contaJogoId;
      
      if (isEditing) {
        await transacaoService.atualizar(id, transacaoData);
        message = 'Transação atualizada com sucesso';
      } else {
        await transacaoService.adicionar(transacaoData);
        message = 'Transação criada com sucesso';
      }
      
      enqueueSnackbar(message, { variant: 'success' });
      navigate('/transacoes');
    } catch (error) {
      enqueueSnackbar(
        isEditing ? 'Erro ao atualizar transação' : 'Erro ao criar transação', 
        { variant: 'error' }
      );
      console.error('Erro ao salvar transação:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/transacoes');
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
          {isEditing ? 'Editar Transação' : 'Nova Transação'}
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
                  value={transacao.descricao}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.descricao}
                  helperText={errors.descricao}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="valor"
                  label="Valor"
                  type="number"
                  value={transacao.valor}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.valor}
                  helperText={errors.valor}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputProps: { step: "0.01", min: "0" }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="data"
                  label="Data e Hora"
                  type="datetime-local"
                  value={transacao.data}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.data}
                  helperText={errors.data}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.tipo}>
                  <InputLabel id="tipo-label">Tipo</InputLabel>
                  <Select
                    labelId="tipo-label"
                    name="tipo"
                    value={transacao.tipo}
                    onChange={handleChange}
                    label="Tipo"
                  >
                    {tipos.map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                    ))}
                  </Select>
                  {errors.tipo && (
                    <FormHelperText>{errors.tipo}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={transacao.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    {status.map((statusItem) => (
                      <MenuItem key={statusItem} value={statusItem}>{statusItem}</MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.usuarioId}>
                  <InputLabel id="usuario-label">Usuário</InputLabel>
                  <Select
                    labelId="usuario-label"
                    name="usuarioId"
                    value={transacao.usuarioId}
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
                <FormControl fullWidth>
                  <InputLabel id="conta-jogo-label">Conta de Jogo (Opcional)</InputLabel>
                  <Select
                    labelId="conta-jogo-label"
                    name="contaJogoId"
                    value={transacao.contaJogoId}
                    onChange={handleChange}
                    label="Conta de Jogo (Opcional)"
                  >
                    <MenuItem value="">
                      <em>Nenhuma</em>
                    </MenuItem>
                    {contasJogo.map((conta) => (
                      <MenuItem key={conta.id} value={conta.id}>
                        {conta.jogo?.nome} - {conta.nomePersonagem} ({conta.usuario?.nome})
                      </MenuItem>
                    ))}
                  </Select>
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

export default TransacaoForm; 