import api from './api';

const endpoint = '/anuncios';

const anuncioService = {
  // Listar todos os anúncios com opções de filtro e paginação
  listar: async (page = 0, size = 10, descricao = '', precoMin = '', precoMax = '') => {
    try {
      let url = `${endpoint}?page=${page}&size=${size}`;
      
      if (descricao) url += `&descricao=${encodeURIComponent(descricao)}`;
      if (precoMin) url += `&precoMin=${precoMin}`;
      if (precoMax) url += `&precoMax=${precoMax}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar anúncios:', error);
      throw error;
    }
  },

  // Buscar anúncio por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anúncio ${id}:`, error);
      throw error;
    }
  },

  // Adicionar novo anúncio
  adicionar: async (anuncio) => {
    try {
      const response = await api.post(endpoint, anuncio);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar anúncio:', error);
      throw error;
    }
  },

  // Atualizar anúncio existente
  atualizar: async (anuncio) => {
    try {
      const response = await api.put(`${endpoint}/${anuncio.id}`, anuncio);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anúncio ${anuncio.id}:`, error);
      throw error;
    }
  },

  // Excluir anúncio
  excluir: async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir anúncio ${id}:`, error);
      throw error;
    }
  },

  // Listar com paginação sem filtro
    listarPaginado: async (page = 0, size = 10) => {
        try {
        const response = await api.get(`/anuncios/paginados?page=${page}&size=${size}`);
        return response.data;
        } catch (error) {
        console.error('Erro ao listar anúncios paginados:', error);
        throw error;
        }
    },
  
  // Buscar por descrição
  buscarPorDescricao: async (descricao, page = 0, size = 10) => {
    try {
      const response = await api.get(`/anuncios/busca/descricao?descricao=${descricao}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncios por descrição:', error);
      throw error;
    }
  },
  
  // Buscar por preço máximo
  buscarPorPrecoMaximo: async (precoMax, page = 0, size = 10) => {
    try {
      const response = await api.get(`/anuncios/busca/precoMaximo?precoMax=${precoMax}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncios por preço máximo:', error);
      throw error;
    }
  },
  
  // Buscar por preço mínimo
  buscarPorPrecoMinimo: async (precoMin, page = 0, size = 10) => {
    try {
      const response = await api.get(`/anuncios/busca/precoMinimo?precoMin=${precoMin}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncios por preço mínimo:', error);
      throw error;
    }
  },
  
};



export default anuncioService; 