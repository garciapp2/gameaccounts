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
  InputAdornment
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
import jogoService from '../services/jogoService';

const Jogos = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jogoToDelete, setJogoToDelete] = useState(null);

  // Carregar jogos
  useEffect(() => {
    fetchJogos();
  }, [page, rowsPerPage]);

  const fetchJogos = async () => {
    try {
      setLoading(true);
      let response;
  
      if (search) {
        response = await jogoService.buscarPorNomePaginado(search, page, rowsPerPage);
      } else {
        const response = await jogoService.listar();
        setJogos(response); // listar() retorna array direto
        setTotalElements(response.length);
      }
  
      setJogos(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar jogos', { variant: 'error' });
      console.error('Erro ao buscar jogos:', error);
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
    navigate('/jogos/novo');
  };

  const handleEditClick = (id) => {
    navigate(`/jogos/${id}`);
  };

  const handleDeleteClick = (jogo) => {
    setJogoToDelete(jogo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await jogoService.excluir(jogoToDelete.id);
      fetchJogos();
      enqueueSnackbar('Jogo removido com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover jogo', { variant: 'error' });
      console.error('Erro ao remover jogo:', error);
    } finally {
      setDeleteDialogOpen(false);
      setJogoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setJogoToDelete(null);
  };

  // Formatação de preço
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco || 0);
  };

  // Local search implementation (client-side)
  const filteredJogos = search.trim() === '' 
    ? jogos
    : jogos.filter(jogo => 
        jogo.nome.toLowerCase().includes(search.toLowerCase()) ||
        jogo.plataforma.toLowerCase().includes(search.toLowerCase())
      );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  if (loading && !jogos.length) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader
        title="Jogos"
        buttonText="Novo Jogo"
        onButtonClick={handleAddClick}
      />

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar jogo..."
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
                <TableCell>Nome</TableCell>
                <TableCell>Plataforma</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJogos.map((jogo) => (
                <TableRow key={jogo.id}>
                  <TableCell>{jogo.id}</TableCell>
                  <TableCell>{jogo.nome}</TableCell>
                  <TableCell>{jogo.plataforma}</TableCell>
                  <TableCell>{formatarPreco(jogo.preco)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(jogo.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(jogo)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredJogos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum jogo encontrado.
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
        message={`Tem certeza que deseja excluir o jogo "${jogoToDelete?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default Jogos; 