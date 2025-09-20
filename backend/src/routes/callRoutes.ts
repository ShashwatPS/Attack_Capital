import { getCalls, getHistory } from "../controllers/callController.js";
import express from "express";

const router = express.Router();

router.get("/logs/:botID", getCalls);
router.get("/history/:callID", getHistory)

export default router;
