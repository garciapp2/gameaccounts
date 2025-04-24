const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove o prefixo /api para requisições ao backend
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Erro de proxy: não foi possível conectar ao servidor backend');
      },
    })
  );
  
  // Adicionar uma rota para lidar com favicon e outros assets estáticos
  app.use('/favicon.ico', (req, res) => {
    res.status(204).end(); // Responder com código 204 (No Content)
  });
  
  app.use('/logo192.png', (req, res) => {
    res.status(204).end();
  });
}; 