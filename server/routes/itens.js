import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const [itens] = await db.execute(
    `SELECT i.id_item, i.nome, c.nome AS categoria
       FROM item i JOIN categoria c ON c.id_categoria = i.id_categoria
      WHERE i.ativo = TRUE
      ORDER BY c.nome, i.nome`,
  );
  res.json(itens);
});

export default router;
