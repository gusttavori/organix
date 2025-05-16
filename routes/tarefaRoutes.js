const express = require("express");
const Tarefa = require("../models/tarefa");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Aplica o middleware a todas as rotas abaixo
router.use(authMiddleware);

// Criar tarefa
router.post("/", async (req, res) => {
  try {
    const { tarefa, descricao, status, prioridade } = req.body;
    const userId = req.userId;

    const novaTarefa = new Tarefa({ tarefa, descricao, status, prioridade, userId });
    await novaTarefa.save();
    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).json({ erro: "Erro ao adicionar tarefa" });
  }
});

// Listar tarefas do usuário
router.get("/", async (req, res) => {
  try {
    const tarefas = await Tarefa.find({ userId: req.userId });
    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
});

// Buscar tarefa por ID
router.get("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    res.status(200).json(tarefa);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
});

// Atualizar tarefa (PUT)
router.put("/:id", async (req, res) => {
  try {
    const tarefaDoc = await Tarefa.findById(req.params.id);
    if (!tarefaDoc) return res.status(404).json({ erro: "Tarefa não encontrada" });

    if (tarefaDoc.userId.toString() !== req.userId) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const { tarefa, descricao, status, prioridade } = req.body;
    tarefaDoc.tarefa = tarefa;
    tarefaDoc.descricao = descricao;
    tarefaDoc.status = status;
    tarefaDoc.prioridade = prioridade;

    await tarefaDoc.save();
    res.status(200).json(tarefaDoc);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
});

// Atualização parcial (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const tarefaDoc = await Tarefa.findById(req.params.id);
    if (!tarefaDoc) return res.status(404).json({ erro: "Tarefa não encontrada" });

    if (tarefaDoc.userId.toString() !== req.userId) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const campos = ["tarefa", "descricao", "status", "prioridade"];
    campos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        tarefaDoc[campo] = req.body[campo];
      }
    });

    await tarefaDoc.save();
    res.status(200).json(tarefaDoc);
  } catch (error) {
    console.error("Erro ao atualizar tarefa parcialmente:", error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa parcialmente" });
  }
});

// Deletar tarefa
router.delete("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    await tarefa.deleteOne();
    res.status(200).json({ mensagem: "Tarefa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
});

module.exports = router;