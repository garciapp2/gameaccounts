import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
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
  Chip,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingCircle from '../components/LoadingCircle';
import contaJogoService from '../services/contaJogoService';

const ContasJogo = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contaToDelete, setContaToDelete] = useState(null);

  // Carregar contas
  useEffect(() => {
    fetchContas();
  }, [page, rowsPerPage]);

  const fetchContas = async () => {
    try {
      setLoading(true);
      const response = await contaJogoService.listarPaginado(page, rowsPerPage);
      
      setContas(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar contas de jogo', { variant: 'error' });
      console.error('Erro ao buscar contas de jogo:', error);
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
    navigate('/contas/novo');
  };

  const handleEditClick = (id) => {
    navigate(`/contas/${id}`);
  };

  const handleDeleteClick = (conta) => {
    setContaToDelete(conta);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await contaJogoService.remover(contaToDelete.id);
      fetchContas();
      enqueueSnackbar('Conta de jogo removida com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover conta de jogo', { variant: 'error' });
      console.error('Erro ao remover conta de jogo:', error);
    } finally {
      setDeleteDialogOpen(false);
      setContaToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setContaToDelete(null);
  };

  // Local search implementation (client-side)
  const filteredContas = search.trim() === '' 
    ? contas
    : contas.filter(conta => 
        conta.login.toLowerCase().includes(search.toLowerCase()) ||
        (conta.jogo && conta.jogo.nome.toLowerCase().includes(search.toLowerCase()))
      );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  if (loading && !contas.length) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader
        title="Contas de Jogos"
        buttonText="Nova Conta"
        onButtonClick={handleAddClick}
      />

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar por login ou jogo..."
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
                <TableCell>Login</TableCell>
                <TableCell>Jogo</TableCell>
                <TableCell>Plataforma</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell>{conta.id}</TableCell>
                  <TableCell>{conta.login}</TableCell>
                  <TableCell>{conta.jogo?.nome || 'N/A'}</TableCell>
                  <TableCell>
                    {conta.jogo?.plataforma && (
                      <Chip 
                        label={conta.jogo.plataforma} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(conta.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(conta)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredContas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma conta de jogo encontrada.
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
        message={`Tem certeza que deseja excluir a conta "${contaToDelete?.login}" do jogo "${contaToDelete?.jogo?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default ContasJogo; 