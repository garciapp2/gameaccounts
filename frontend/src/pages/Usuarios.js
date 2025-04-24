import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
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
import usuarioService from '../services/usuarioService';

const Usuarios = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('nome');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Carregar usuários
  useEffect(() => {
    fetchUsuarios();
  }, [page, rowsPerPage, search, searchType]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      let response;

      if (search) {
        if (searchType === 'nome') {
          response = await usuarioService.buscarPorNome(search, page, rowsPerPage);
        } else if (searchType === 'email') {
          response = await usuarioService.buscarPorEmail(search, page, rowsPerPage);
        }
      } else {
        response = await usuarioService.listarPaginado(page, rowsPerPage);
      }

      setUsuarios(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar usuários', { variant: 'error' });
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    navigate('/usuarios/novo');
  };

  const handleEditClick = (id) => {
    navigate(`/usuarios/${id}`);
  };

  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await usuarioService.remover(userToDelete.id);
      fetchUsuarios();
      enqueueSnackbar('Usuário removido com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover usuário', { variant: 'error' });
      console.error('Erro ao remover usuário:', error);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (loading && !usuarios.length) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader
        title="Usuários"
        buttonText="Novo Usuário"
        onButtonClick={handleAddClick}
      />

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ width: 120, mr: 2 }}>
            <InputLabel id="search-type-label">Buscar por</InputLabel>
            <Select
              labelId="search-type-label"
              value={searchType}
              label="Buscar por"
              onChange={handleSearchTypeChange}
              size="small"
            >
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            placeholder={`Buscar por ${searchType}...`}
            value={search}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1 }}
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
                <TableCell>Email</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(usuario.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(usuario)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && usuarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum usuário encontrado.
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
        message={`Tem certeza que deseja excluir o usuário "${userToDelete?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default Usuarios; 