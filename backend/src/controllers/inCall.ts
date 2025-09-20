import type { Request, Response } from "express";
import { getPrismaClient } from "../prisma/client.js";

const prisma = getPrismaClient();

export const getEmployee = async (req: Request, res: Response) => {
  const { employee_id } = req.body;

  const employee = await prisma.employee.findUnique({
    where: { id: Number(employee_id)},
    select: { name: true,  department: true, location: true },
  });

  res.json({
    result: {
      employee_name: employee?.name || "Unknown",
      employee_location: employee?.location || "",
      employee_department: employee?.department || "",
    },
  });
};