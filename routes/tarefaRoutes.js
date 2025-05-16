const express = require("express");
const Tarefa = require("../models/tarefa");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.use(authMiddleware);

// Criar tarefa
router.post("/", async (req, res) => {
  try {
    const { tarefa, descricao, status, prioridade } = req.body;
    const userId = req.userId;

    const novaTarefa = new Tarefa({ tarefa, descricao, status, prioridade, userId });
    await novaTarefa.save();
    res.status(201).send(novaTarefa);
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).send({ erro: "Erro ao adicionar tarefa" });
  }
});

// Listar tarefas do usuário
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const tarefas = await Tarefa.find({ userId });
    res.status(200).send(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).send({ erro: "Erro ao listar tarefas" });
  }
});

// Buscar tarefa pelo id
router.get("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).send({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).send({ erro: "Acesso negado" });
    }

    res.status(200).send(tarefa);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).send({ erro: "Erro ao buscar tarefa" });
  }
});

// Atualizar tarefa (PUT - substitui toda tarefa)
router.put("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).send({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).send({ erro: "Acesso negado" });
    }

    const { tarefa: novoTitulo, descricao, status, prioridade } = req.body;
    tarefa.tarefa = novoTitulo;
    tarefa.descricao = descricao;
    tarefa.status = status;
    tarefa.prioridade = prioridade;

    await tarefa.save();
    res.status(200).send(tarefa);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).send({ erro: "Erro ao atualizar tarefa" });
  }
});

// Atualizar tarefa parcialmente (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).send({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).send({ erro: "Acesso negado" });
    }

    // Atualiza somente os campos enviados
    const campos = ["tarefa", "descricao", "status", "prioridade"];
    campos.forEach(campo => {
      if (req.body[campo] !== undefined) tarefa[campo] = req.body[campo];
    });

    await tarefa.save();
    res.status(200).send(tarefa);
  } catch (error) {
    console.error("Erro ao atualizar tarefa parcialmente:", error);
    res.status(500).send({ erro: "Erro ao atualizar tarefa parcialmente" });
  }
});

// Deletar tarefa
router.delete("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).send({ erro: "Tarefa não encontrada" });

    if (tarefa.userId.toString() !== req.userId) {
      return res.status(403).send({ erro: "Acesso negado" });
    }

    await Tarefa.deleteOne({ _id: req.params.id });

    res.status(200).send({ mensagem: "Tarefa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).send({ erro: "Erro ao deletar tarefa" });
  }
});

module.exports = router;