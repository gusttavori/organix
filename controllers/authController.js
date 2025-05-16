const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.js');

// Função para registrar um novo usuário
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificando se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'E-mail já está em uso' });
    }

    // Criando o novo usuário
    const usuario = new Usuario({ nome, email, senha });
    await usuario.save();

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Função de login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Procurando o usuário pelo e-mail
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Verificando a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Gerando o token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};