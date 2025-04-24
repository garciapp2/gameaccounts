import api from './api';

const endpoint = '/jogos';

const jogoService = {
  // Listar todos os jogos
  listar: async () => {
    try {
      console.log('Iniciando requisição para listar jogos');
      const response = await api.get(endpoint);
      console.log('Jogos recebidos da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar jogos:', error);
      throw error;
    }
  },

  // Buscar jogo por ID
  buscarPorId: async (id) => {
    try {
      console.log(`Buscando jogo com ID ${id}`);
      const response = await api.get(`${endpoint}/${id}`);
      console.log('Jogo encontrado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar jogo ${id}:`, error);
      throw error;
    }
  },

  // Adicionar novo jogo
  adicionar: async (jogo) => {
    try {
      console.log('Enviando requisição para adicionar jogo:', jogo);
      const response = await api.post(endpoint, jogo);
      console.log('Resposta da API (adicionar):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      throw error;
    }
  },

  // Criar novo jogo (alias para adicionar)
  criar: async (jogo) => {
    return jogoService.adicionar(jogo);
  },

  // Atualizar jogo existente
  atualizar: async (id, jogo) => {
    try {
      console.log(`Atualizando jogo ${id} com dados:`, jogo);
      const response = await api.put(`${endpoint}/${id}`, jogo);
      console.log('Resposta da API (atualizar):', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar jogo ${id}:`, error);
      throw error;
    }
  },

  // Excluir jogo
  excluir: async (id) => {
    try {
      console.log(`Excluindo jogo com ID ${id}`);
      const response = await api.delete(`${endpoint}/${id}`);
      console.log('Resposta da API (excluir):', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir jogo ${id}:`, error);
      throw error;
    }
  },
  
  // Remover jogo (alias para excluir)
  remover: async (id) => {
    return jogoService.excluir(id);
  },
  
  // Buscar jogos por nome
  buscarPorNome: async (nome) => {
    try {
      console.log(`Buscando jogos com nome contendo "${nome}"`);
      const response = await api.get(`${endpoint}/buscar?nome=${nome}`);
      console.log('Jogos encontrados por nome:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar jogos por nome "${nome}":`, error);
      throw error;
    }
  },

  // Listar jogos paginados
  listarPaginado: async (page = 0, size = 10, sort = 'nome', direction = 'asc') => {
    try {
      const response = await api.get(`${endpoint}/paginado?page=${page}&size=${size}&sort=${sort},${direction}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar jogos paginados:', error);
      throw error;
    }
  }
};

export default jogoService; 