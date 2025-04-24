import api from './api';

const endpoint = '/contas-jogo';

const gameAccountService = {
  // Listar todas as contas de jogo
  listar: async () => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar contas de jogo:', error);
      throw error;
    }
  },

  // Buscar conta de jogo por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conta de jogo ${id}:`, error);
      throw error;
    }
  },

  // Adicionar nova conta de jogo
  adicionar: async (contaJogo) => {
    try {
      const response = await api.post(endpoint, contaJogo);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar conta de jogo:', error);
      throw error;
    }
  },

  // Atualizar conta de jogo existente
  atualizar: async (contaJogo) => {
    try {
      const response = await api.put(`${endpoint}/${contaJogo.id}`, contaJogo);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar conta de jogo ${contaJogo.id}:`, error);
      throw error;
    }
  },

  // Excluir conta de jogo
  excluir: async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir conta de jogo ${id}:`, error);
      throw error;
    }
  }
};

export default gameAccountService; 