import type { Request, Response } from "express";
import { getPrismaClient } from "../prisma/client.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = getPrismaClient();

export const postCall = async (req: Request, res: Response) => {
  const { summary, createdAt } = req.body;
  const phone = 'web_call';      // Hardcoding this again because of test mode

  try {
    const visitor = await prisma.visitor.findUnique({
      where: { phone },
    });

    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    await prisma.call.create({
      data: {
        summary,
        arrivalTime: createdAt,
        visitor: {
          connect: { id: visitor.id },
        },
      },
    });

    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post data" });
  }
};