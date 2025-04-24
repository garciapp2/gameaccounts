import api from './api';

const endpoint = '/transacoes';

const transacaoService = {
  // Listar todas as transações
  listar: async () => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      throw error;
    }
  },

  // Listar transações paginadas
  listarPaginado: async (page = 0, size = 10, sort = 'data', direction = 'desc') => {
    try {
      const response = await api.get(`${endpoint}/paginados?page=${page}&size=${size}&sort=${sort}&direction=${direction.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar transações paginadas:', error);
      throw error;
    }
  },

  // Buscar transação por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar transação ${id}:`, error);
      throw error;
    }
  },

  // Adicionar nova transação
  adicionar: async (transacao) => {
    try {
      const response = await api.post(endpoint, transacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  },

  // Atualizar transação existente
  atualizar: async (id, transacao) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, transacao);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar transação ${id}:`, error);
      throw error;
    }
  },

  // Excluir transação
  excluir: async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir transação ${id}:`, error);
      throw error;
    }
  },
  
  // Aliases para manter compatibilidade com código existente
  listarTodos: async () => {
    return transacaoService.listar();
  },
  
  criar: async (transacao) => {
    return transacaoService.adicionar(transacao);
  },
  
  remover: async (id) => {
    return transacaoService.excluir(id);
  }
};

export default transacaoService; 