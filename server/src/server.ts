import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001; // Porta para o back-end

app.use(cors({
  origin: 'http://localhost:5173' // Permite requisições apenas do seu front-end
}));
// Uma rota de teste para ver se a API está funcionando
app.get('/api/healthcheck', (_req, res) => {
    res.json({ message: 'API está funcionando perfeitamente!', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});