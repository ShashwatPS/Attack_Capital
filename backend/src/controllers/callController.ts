import type { Request, Response } from "express";

export const getCalls = async (req: Request, res: Response) => {
    const { botID } = req.params;

    const apiKey = process.env.OPENMIC_API_KEY;

    if (!botID) {
        return res.status(400).json({ error: "Bot ID not found" });
    }

    const url = `https://api.openmic.ai/v1/calls?bot_id=${botID}`;

    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create bot" });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    const { callID } = req.params;

    const apiKey = process.env.OPENMIC_API_KEY;

    if (!callID) {
        return res.status(400).json({ error: "Bot ID not found" });
    }

    const url = `https://api.openmic.ai/v1/call/${callID}`;

    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create bot" });
    }
};