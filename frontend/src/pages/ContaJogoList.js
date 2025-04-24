import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import contaJogoService from '../services/contaJogoService';

function ContaJogoList() {
  const [contasJogo, setContasJogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contaParaExcluir, setContaParaExcluir] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    carregarContasJogo();
  }, []);

  const carregarContasJogo = async () => {
    setLoading(true);
    try {
      const data = await contaJogoService.listar();
      setContasJogo(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar contas de jogos:', error);
      setError('Não foi possível carregar as contas de jogos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = (conta) => {
    setContaParaExcluir(conta);
    setDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    setDialogOpen(false);
    if (!contaParaExcluir) return;

    try {
      await contaJogoService.excluir(contaParaExcluir.id);
      setContasJogo(contasJogo.filter(conta => conta.id !== contaParaExcluir.id));
      setSnackbar({
        open: true,
        message: 'Conta de jogo excluída com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao excluir conta de jogo:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir conta de jogo',
        severity: 'error'
      });
    }
  };

  const fecharSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contas de Jogos
          </Typography>
          <Button
            component={Link}
            to="/contas-jogo/novo"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Nova Conta
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : contasJogo.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Nenhuma conta de jogo encontrada. Clique no botão "Nova Conta" para adicionar.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Jogo</TableCell>
                  <TableCell>Nome do Personagem</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasJogo.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell>{conta.id}</TableCell>
                    <TableCell>{conta.usuario?.nome}</TableCell>
                    <TableCell>{conta.jogo?.nome}</TableCell>
                    <TableCell>{conta.nomePersonagem}</TableCell>
                    <TableCell>{conta.nivel}</TableCell>
                    <TableCell>R$ {conta.saldo.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={Link}
                        to={`/contas-jogo/editar/${conta.id}`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleExcluir(conta)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a conta de jogo 
            {contaParaExcluir ? ` "${contaParaExcluir.nomePersonagem}" do usuário ${contaParaExcluir.usuario?.nome}` : ''}?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmarExclusao} color="secondary" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={fecharSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={fecharSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ContaJogoList; 