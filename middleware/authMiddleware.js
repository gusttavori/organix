const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.js"); // Garanta que o caminho para o modelo Usuario está correto

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Verifica se o usuário existe no banco de dados
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado, token inválido" });
    }
    
    req.userId = decoded.id; // Adiciona o ID do usuário ao objeto req
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ erro: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ erro: "Token inválido" });
    }
    console.error("Erro na autenticação do token:", error);
    return res.status(500).json({ erro: "Falha na autenticação do token" });
  }
};

module.exports = authMiddleware;
