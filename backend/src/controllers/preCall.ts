import type { Request, Response } from "express";

export const preCall = async (req: Request, res: Response) => {
    const { call } = req.body;

    

    try {
        res.json({
            call: {
                dynamic_variables: "123"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create bot" });
    }
};