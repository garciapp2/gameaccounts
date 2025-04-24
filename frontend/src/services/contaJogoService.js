import axios from 'axios';
import api from './api';



const API_URL = 'http://localhost:8080';
const endpoint = '/contas-jogo';

/**
 * Serviço para gerenciar as operações CRUD de contas de jogo
 */
const contaJogoService = {
  /**
   * Lista todas as contas de jogo
   * @returns {Promise<Array>} Lista de contas de jogo
   */
  listar: async () => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar contas de jogo:', error);
      throw error;
    }
  },

  listarPaginado: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/contas/paginados?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar contas paginadas:', error);
      throw error;
    }
  },
  

  /**
   * Busca uma conta de jogo pelo ID
   * @param {number} id - ID da conta de jogo
   * @returns {Promise<Object>} Conta de jogo encontrada
   */
  buscarPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conta de jogo com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Adiciona uma nova conta de jogo
   * @param {Object} contaJogo - Dados da nova conta de jogo
   * @returns {Promise<Object>} Conta de jogo criada
   */
  adicionar: async (contaJogo) => {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, contaJogo);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar conta de jogo:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma conta de jogo existente
   * @param {number} id - ID da conta de jogo
   * @param {Object} contaJogo - Novos dados da conta de jogo
   * @returns {Promise<Object>} Conta de jogo atualizada
   */
  atualizar: async (id, contaJogo) => {
    try {
      const response = await axios.put(`${API_URL}${endpoint}/${id}`, contaJogo);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar conta de jogo com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma conta de jogo
   * @param {number} id - ID da conta de jogo a ser excluída
   * @returns {Promise<void>}
   */
  excluir: async (id) => {
    try {
      await axios.delete(`${API_URL}${endpoint}/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir conta de jogo com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca contas de jogo por usuário
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} Lista de contas de jogo do usuário
   */
  buscarPorUsuario: async (usuarioId) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar contas de jogo do usuário ${usuarioId}:`, error);
      throw error;
    }
  },

  /**
   * Busca contas de jogo por jogo
   * @param {number} jogoId - ID do jogo
   * @returns {Promise<Array>} Lista de contas de jogo para o jogo especificado
   */
  buscarPorJogo: async (jogoId) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}/jogo/${jogoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar contas de jogo para o jogo ${jogoId}:`, error);
      throw error;
    }
  }
};

export default contaJogoService; 