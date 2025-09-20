import type { Request, Response } from "express";
import { getPrismaClient } from "../prisma/client.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = getPrismaClient();

export const preCall = async (req: Request, res: Response) => {
  const { call } = req.body;

  const getData = await prisma.visitor.findUnique({
    where: {
      phone: "web_call", // Hardcoding this because in test mode the phone number is web_call
    },
    select: {
      name: true,
      calls: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          summary: true,
          arrivalTime: true,
        },
      },
    },
  });

  const finalValues = {
    customer_name: getData?.name || "Guest",
    last_call_summary: (() => {
      const lastCall = getData?.calls?.[0];
      if (!lastCall) return "No previous call history available.";

      const datePart = lastCall.arrivalTime
        ? `On ${new Date(lastCall.arrivalTime).toDateString()}, `
        : "";
      const summaryPart = lastCall.summary || "No summary available.";

      return `${datePart}visitor visited Support. Summary: ${summaryPart}`;
    })(),
  };

  try {
    res.json({
      call: {
        dynamic_variables: finalValues,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create bot" });
  }
};
