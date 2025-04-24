import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingCircle from '../components/LoadingCircle';
import transacaoService from '../services/transacaoService';

const Transacoes = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transacaoToDelete, setTransacaoToDelete] = useState(null);

  // Carregar transações
  useEffect(() => {
    fetchTransacoes();
  }, [page, rowsPerPage]);

  const fetchTransacoes = async () => {
    try {
      setLoading(true);
      const response = await transacaoService.listarPaginado(page, rowsPerPage);
      
      setTransacoes(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar transações', { variant: 'error' });
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    navigate('/transacoes/novo');
  };

  const handleViewClick = (id) => {
    navigate(`/transacoes/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/transacoes/${id}`);
  };

  const handleDeleteClick = (transacao) => {
    setTransacaoToDelete(transacao);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await transacaoService.excluir(transacaoToDelete.id);
      fetchTransacoes();
      enqueueSnackbar('Transação removida com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover transação', { variant: 'error' });
      console.error('Erro ao remover transação:', error);
    } finally {
      setDeleteDialogOpen(false);
      setTransacaoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransacaoToDelete(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  // Formatação de data
  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  // Formatação de valor
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  // Status de transação
  const getStatusChip = (status) => {
    const statusConfig = {
      PENDENTE: { color: 'warning', label: 'Pendente' },
      CONCLUIDA: { color: 'success', label: 'Concluída' },
      CANCELADA: { color: 'error', label: 'Cancelada' },
      PROCESSANDO: { color: 'info', label: 'Processando' },
      REEMBOLSADA: { color: 'default', label: 'Reembolsada' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small" 
        variant="outlined"
      />
    );
  };

  // Filtragem local
  const filteredTransacoes = search.trim() === '' 
    ? transacoes
    : transacoes.filter(transacao => 
        (transacao.usuario?.nome || '').toLowerCase().includes(search.toLowerCase()) ||
        (transacao.descricao || '').toLowerCase().includes(search.toLowerCase()) ||
        transacao.tipo.toLowerCase().includes(search.toLowerCase())
      );

  if (loading && !transacoes.length) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader
        title="Transações"
        buttonText="Nova Transação"
        onButtonClick={handleAddClick}
      />

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar transação..."
            value={search}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell>{transacao.id}</TableCell>
                  <TableCell>{formatarData(transacao.data)}</TableCell>
                  <TableCell>{transacao.descricao}</TableCell>
                  <TableCell>{transacao.usuario?.nome || 'N/A'}</TableCell>
                  <TableCell>{transacao.tipo}</TableCell>
                  <TableCell>{formatarValor(transacao.valor)}</TableCell>
                  <TableCell>{getStatusChip(transacao.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewClick(transacao.id)}
                      size="small"
                      title="Visualizar"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(transacao.id)}
                      size="small"
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(transacao)}
                      size="small"
                      title="Excluir"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredTransacoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a transação "${transacaoToDelete?.id}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default Transacoes; 