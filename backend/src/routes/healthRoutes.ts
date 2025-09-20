import express from "express";
import type { Request, Response } from "express";
const router = express.Router();

router.get("/check", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

export default router;
