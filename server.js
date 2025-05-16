require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Importa o middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/tarefas', tarefaRoutes);

// Rota protegida para teste do token JWT
app.get('/test', authMiddleware, (req, res) => {
  res.json({ message: "Token válido!", userId: req.userId });
});

// Rota para carregar index.html no root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexão com MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Banco de dados conectado com sucesso!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));