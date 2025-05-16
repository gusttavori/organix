const Tarefa = require('../models/tarefa.js');

// GET /tarefas
exports.listarTarefas = async (req, res) => {
  const tarefas = await Tarefa.find().sort('-createdAt');
  res.json(tarefas);
};

// POST /tarefas
exports.criarTarefa = async (req, res) => {
  try {
    const novaTarefa = new Tarefa(req.body);
    await novaTarefa.save();
    res.status(201).json(novaTarefa);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// PUT /tarefas/:id
exports.atualizarTarefa = async (req, res) => {
  try {
    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tarefaAtualizada) return res.status(404).json({ erro: 'Tarefa não encontrada' });
    res.json(tarefaAtualizada);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// DELETE /tarefas/:id
exports.deletarTarefa = async (req, res) => {
  const tarefaRemovida = await Tarefa.findByIdAndDelete(req.params.id);
  if (!tarefaRemovida) return res.status(404).json({ erro: 'Tarefa não encontrada' });
  res.json({ mensagem: 'Tarefa removida com sucesso' });
};
