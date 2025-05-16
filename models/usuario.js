const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definindo o esquema do usuário
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

// Criptografando a senha antes de salvar o usuário
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Criando o modelo de usuário com o esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportando o modelo
module.exports = Usuario;