const express = require('express');
const Usuario = require('../models/usuario');

const router = express.Router();

router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'E-mail já está em uso' });
    }

    // Cria e salva o novo usuário (senha será criptografada no schema)
    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
  }
});

module.exports = router;