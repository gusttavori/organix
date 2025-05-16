const mongoose = require("mongoose");

const TarefaSchema = new mongoose.Schema({
  tarefa: {
    type: String,
    required: true,
  },
  descricao: String,
  prioridade: {
    type: String, 
    enum: ["Baixa", "Média", "Alta"], 
    default: "Média" 
  },
  status: { 
    type: String, 
    enum: ["Pendente", "Em andamento", "Concluída"], 
    default: "Pendente" 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario", // Referencia o modelo Usuario
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("tarefa", TarefaSchema);
