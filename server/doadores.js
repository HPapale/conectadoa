import { Router } from "express";
import { pool } from "./db.js";

const router = Router();

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get("/", async (req, res) => {
  try {
    const [linhas] = await pool.query(
      "SELECT id_doador, nome, email, telefone, data_cadastro FROM doador ORDER BY id_doador DESC",
    );
    res.json(linhas);
  } catch {
    res.status(500).json({ erro: "Falha ao listar doadores" });
  }
});

router.post("/", async (req, res) => {
  const { nome, email, telefone } = req.body ?? {};

  if (!nome || !String(nome).trim()) {
    return res.status(400).json({ erro: "Informe o nome" });
  }
  if (!email || !EMAIL_VALIDO.test(String(email))) {
    return res.status(400).json({ erro: "E-mail inválido" });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO doador (nome, email, telefone) VALUES (?, ?, ?)",
      [String(nome).trim(), String(email).trim(), telefone || null],
    );
    res.status(201).json({ id_doador: resultado.insertId });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }
    res.status(500).json({ erro: "Falha ao cadastrar doador" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await pool.query("DELETE FROM doador WHERE id_doador = ?", [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado" });
    }
    res.status(204).end();
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ erro: "Doador possui doações e não pode ser removido" });
    }
    res.status(500).json({ erro: "Falha ao remover doador" });
  }
});

export default router;
