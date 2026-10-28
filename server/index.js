import "dotenv/config";
import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ConectaDoa", hora: new Date().toISOString() });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const [linhas] = await pool.query(
      "SELECT COUNT(*) AS tabelas FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME],
    );
    res.json({ status: "ok", banco: process.env.DB_NAME, tabelas: linhas[0].tabelas });
  } catch (erro) {
    res.status(500).json({ status: "erro", mensagem: "Falha ao conectar no banco" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
