import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Páginas
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import UsuarioForm from './pages/UsuarioForm';
import Anuncios from './pages/Anuncios';
import AnuncioForm from './pages/AnuncioForm';
import Jogos from './pages/Jogos';
import JogoForm from './pages/JogoForm';
import ContasJogo from './pages/ContasJogo';
import ContaJogoForm from './pages/ContaJogoForm';
// Agora estas páginas existem
import Transacoes from './pages/Transacoes';
import TransacaoForm from './pages/TransacaoForm';

// Componentes
import Layout from './components/Layout';

// Tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Verde escuro
    },
    secondary: {
      main: '#f50057', // Rosa
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="usuarios">
                <Route index element={<Usuarios />} />
                <Route path="novo" element={<UsuarioForm />} />
                <Route path=":id" element={<UsuarioForm />} />
              </Route>
              <Route path="anuncios">
                <Route index element={<Anuncios />} />
                <Route path="novo" element={<AnuncioForm />} />
                <Route path=":id" element={<AnuncioForm />} />
              </Route>
              <Route path="jogos">
                <Route index element={<Jogos />} />
                <Route path="novo" element={<JogoForm />} />
                <Route path=":id" element={<JogoForm />} />
              </Route>
              <Route path="contas">
                <Route index element={<ContasJogo />} />
                <Route path="novo" element={<ContaJogoForm />} />
                <Route path=":id" element={<ContaJogoForm />} />
              </Route>
              <Route path="transacoes">
                <Route index element={<Transacoes />} />
                <Route path="novo" element={<TransacaoForm />} />
                <Route path=":id" element={<TransacaoForm />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 