import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar interceptor para logs de requisições
api.interceptors.request.use(
  config => {
    console.log('🚀 Requisição enviada:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Adicionar interceptor para logs de respostas
api.interceptors.response.use(
  response => {
    console.log('✅ Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('❌ Erro na resposta:', error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.response.config?.url
    } : error.message);
    return Promise.reject(error);
  }
);

export default api; 