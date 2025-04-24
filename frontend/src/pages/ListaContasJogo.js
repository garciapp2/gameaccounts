import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import contaJogoService from '../services/contaJogoService';

const ListaContasJogo = () => {
  const [contasJogo, setContasJogo] = useState([]);
  const [filteredContasJogo, setFilteredContasJogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  const carregarContasJogo = async () => {
    setLoading(true);
    try {
      const data = await contaJogoService.listar();
      setContasJogo(data);
      setFilteredContasJogo(data);
    } catch (error) {
      console.error('Erro ao carregar contas de jogo:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar as contas de jogo. Tente novamente mais tarde.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContasJogo();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contasJogo.filter(conta => 
        conta.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.jogo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.nomePersonagem.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContasJogo(filtered);
    } else {
      setFilteredContasJogo(contasJogo);
    }
    setPage(0);
  }, [searchTerm, contasJogo]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddConta = () => {
    navigate('/contas-jogo/novo');
  };

  const handleEditConta = (id) => {
    navigate(`/contas-jogo/editar/${id}`);
  };

  const handleDeleteConta = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta de jogo?')) {
      try {
        await contaJogoService.excluir(id);
        setSnackbar({
          open: true,
          message: 'Conta de jogo excluída com sucesso!',
          severity: 'success'
        });
        carregarContasJogo();
      } catch (error) {
        console.error('Erro ao excluir conta de jogo:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao excluir a conta de jogo. Tente novamente mais tarde.',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatarNivel = (nivel) => `Nível ${nivel}`;
  
  const formatarSaldo = (saldo) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(saldo);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contas de Jogo
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddConta}
        >
          Nova Conta
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por usuário, jogo ou personagem..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Jogo</TableCell>
                    <TableCell>Personagem</TableCell>
                    <TableCell>Nível</TableCell>
                    <TableCell>Saldo</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContasJogo.length > 0 ? (
                    filteredContasJogo
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((conta) => (
                        <TableRow key={conta.id}>
                          <TableCell>{conta.usuario.nome}</TableCell>
                          <TableCell>{conta.jogo.nome}</TableCell>
                          <TableCell>{conta.nomePersonagem}</TableCell>
                          <TableCell>{formatarNivel(conta.nivel)}</TableCell>
                          <TableCell>{formatarSaldo(conta.saldo)}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEditConta(conta.id)}
                              title="Editar"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteConta(conta.id)}
                              title="Excluir"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhuma conta de jogo encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredContasJogo.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </>
        )}
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

export default ListaContasJogo; 