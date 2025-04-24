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
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  FilterAlt as FilterIcon,
  FilterAltOff as FilterOffIcon
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingCircle from '../components/LoadingCircle';
import anuncioService from '../services/anuncioService';

const Anuncios = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anuncioToDelete, setAnuncioToDelete] = useState(null);
  
  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [descricaoFilter, setDescricaoFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(0);

  // Carregar anúncios
  useEffect(() => {
    fetchAnuncios();
  }, [page, rowsPerPage, filterType, descricaoFilter, priceRange]);

  const fetchAnuncios = async () => {
    try {
      setLoading(true);
      let response;

      if (filterType === 'descricao' && descricaoFilter) {
        response = await anuncioService.buscarPorDescricao(descricaoFilter, page, rowsPerPage);
      } else if (filterType === 'precoMaximo') {
        response = await anuncioService.buscarPorPrecoMaximo(priceRange[1], page, rowsPerPage);
      } else if (filterType === 'precoMinimo') {
        response = await anuncioService.buscarPorPrecoMinimo(priceRange[0], page, rowsPerPage);
      } else {
        response = await anuncioService.listarPaginado(page, rowsPerPage);
      }
      
      setAnuncios(response.content);
      setTotalElements(response.totalElements);
      
      // Determinar o preço máximo para o filtro de preço
      if (!maxPrice && response.content.length > 0) {
        const maxAnuncioPrice = Math.max(...response.content.map(anuncio => anuncio.preco)) * 1.5;
        setMaxPrice(maxAnuncioPrice > 0 ? Math.ceil(maxAnuncioPrice / 100) * 100 : 1000);
        setPriceRange([0, maxAnuncioPrice > 0 ? Math.ceil(maxAnuncioPrice) : 1000]);
      }
    } catch (error) {
      enqueueSnackbar('Erro ao carregar anúncios', { variant: 'error' });
      console.error('Erro ao buscar anúncios:', error);
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
    navigate('/anuncios/novo');
  };

  const handleEditClick = (id) => {
    navigate(`/anuncios/${id}`);
  };

  const handleDeleteClick = (anuncio) => {
    setAnuncioToDelete(anuncio);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await anuncioService.remover(anuncioToDelete.id);
      fetchAnuncios();
      enqueueSnackbar('Anúncio removido com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover anúncio', { variant: 'error' });
      console.error('Erro ao remover anúncio:', error);
    } finally {
      setDeleteDialogOpen(false);
      setAnuncioToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAnuncioToDelete(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
    
    // Resetar filtros específicos quando mudamos o tipo
    if (event.target.value !== 'descricao') {
      setDescricaoFilter('');
    }
  };

  const handleDescricaoFilterChange = (event) => {
    setDescricaoFilter(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleResetFilters = () => {
    setFilterType('');
    setDescricaoFilter('');
    setPriceRange([0, maxPrice]);
    setPage(0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Busca local quando não estamos usando os filtros de backend
  const filteredAnuncios = search.trim() === '' || filterType !== ''
    ? anuncios
    : anuncios.filter(anuncio => 
        anuncio.descricao.toLowerCase().includes(search.toLowerCase()) ||
        anuncio.usuario?.nome.toLowerCase().includes(search.toLowerCase())
      );

  if (loading && !anuncios.length) {
    return <LoadingCircle />;
  }

  return (
    <Box>
      <PageHeader
        title="Anúncios"
        buttonText="Novo Anúncio"
        onButtonClick={handleAddClick}
      />

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Busca rápida..."
            value={search}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1 }}
            disabled={filterType !== ''}
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
          
          <Button
            variant="outlined"
            color={showFilters ? "secondary" : "primary"}
            startIcon={showFilters ? <FilterOffIcon /> : <FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </Box>

        {showFilters && (
          <Box component={Paper} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Filtros Avançados
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="filter-type-label">Tipo de Filtro</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    label="Tipo de Filtro"
                  >
                    <MenuItem value="">Nenhum</MenuItem>
                    <MenuItem value="descricao">Por Descrição</MenuItem>
                    <MenuItem value="precoMaximo">Por Preço Máximo</MenuItem>
                    <MenuItem value="precoMinimo">Por Preço Mínimo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {filterType === 'descricao' && (
                <Grid item xs={12} sm={9}>
                  <TextField
                    label="Descrição contém"
                    value={descricaoFilter}
                    onChange={handleDescricaoFilterChange}
                    fullWidth
                    size="small"
                  />
                </Grid>
              )}
              
              {(filterType === 'precoMaximo' || filterType === 'precoMinimo') && (
                <Grid item xs={12} sm={9}>
                  <Box sx={{ px: 2 }}>
                    <Typography gutterBottom>
                      Faixa de Preço: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    </Typography>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={maxPrice}
                      valueLabelFormat={value => formatCurrency(value)}
                    />
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleResetFilters}
                    startIcon={<FilterOffIcon />}
                  >
                    Limpar Filtros
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Anunciante</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAnuncios.map((anuncio) => (
                <TableRow key={anuncio.id}>
                  <TableCell>{anuncio.id}</TableCell>
                  <TableCell>{anuncio.descricao}</TableCell>
                  <TableCell>{formatCurrency(anuncio.preco)}</TableCell>
                  <TableCell>{anuncio.usuario?.nome || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(anuncio.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(anuncio)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredAnuncios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum anúncio encontrado.
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
        message={`Tem certeza que deseja excluir o anúncio "${anuncioToDelete?.descricao}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default Anuncios; 