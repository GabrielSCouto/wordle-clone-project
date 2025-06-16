import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/gameRoutes';

const app = express();
const PORT = 3001; // Porta para o back-end

// app.use(cors({
//   origin: 'http://localhost:5173' // Permite requisições apenas do front-end
// }));
// // Uma rota de teste para ver se a API está funcionando
// app.get('/api/healthcheck', (_req, res) => {
//     res.json({ message: 'API está funcionando perfeitamente!', timestamp: new Date() });
// });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Essencial para o req.body funcionar

app.use('/api/users', userRoutes); //ROTAS COM O PREFIXO /api/users
app.use('/api/game', gameRoutes); 
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

