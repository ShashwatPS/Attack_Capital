import { createBot, updateBot, deleteBot, listBots } from "../controllers/botController.js";
import express from "express";

const router = express.Router();

router.post("/create", createBot);
router.patch("/update/:uid", updateBot);
router.delete("/delete/:uid", deleteBot);
router.get("/list", listBots);

export default router;
