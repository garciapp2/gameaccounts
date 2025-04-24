import api from './api';

const endpoint = '/usuarios';

const usuarioService = {
  // Listar todos os usuários
  listar: async () => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  // Buscar usuário por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  },

  // Adicionar novo usuário
  adicionar: async (usuario) => {
    try {
      const response = await api.post(endpoint, usuario);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw error;
    }
  },

  // Atualizar usuário existente
  atualizar: async (usuario) => {
    try {
      const response = await api.put(`${endpoint}/${usuario.id}`, usuario);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${usuario.id}:`, error);
      throw error;
    }
  },

  // Excluir usuário
  excluir: async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir usuário ${id}:`, error);
      throw error;
    }
  },
  
  // Autenticar usuário
  login: async (credenciais) => {
    try {
      const response = await api.post(`${endpoint}/login`, credenciais);
      return response.data;
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      throw error;
    }
  },

  // Listar usuários com paginação
  listarPaginado: async (page = 0, size = 10, sort = 'nome', direction = 'asc') => {
    try {
      const response = await api.get(`${endpoint}/paginados?page=${page}&size=${size}&sort=${sort}&direction=${direction.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários paginados:', error);
      throw error;
    }
  },

  // Buscar usuários por nome
  buscarPorNome: async (nome, page = 0, size = 10) => {
    try {
      const response = await api.get(`${endpoint}/busca/nome?nome=${nome}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários por nome:', error);
      throw error;
    }
  },

  // Buscar usuários por email
  buscarPorEmail: async (email, page = 0, size = 10) => {
    try {
      const response = await api.get(`${endpoint}/busca/email?email=${email}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários por email:', error);
      throw error;
    }
  },
  
  // Alias para manter compatibilidade com código existente
  listarTodos: async () => {
    return usuarioService.listar();
  },
  
  criar: async (usuario) => {
    return usuarioService.adicionar(usuario);
  },
  
  remover: async (id) => {
    return usuarioService.excluir(id);
  }
};

export default usuarioService; 