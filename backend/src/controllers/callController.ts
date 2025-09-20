import type { Request, Response } from "express";

export const getCalls = async (req: Request, res: Response) => {
    const { botID } = req.params;

    const pageNo = Number(req.query.page) || 1;
    const limit = 10;

    const offset = (pageNo - 1) * limit;

    const apiKey = process.env.OPENMIC_API_KEY;

    if (!botID) {
        return res.status(400).json({ error: "Bot ID not found" });
    }

    const url = new URL(`https://api.openmic.ai/v1/calls`);
    url.searchParams.append('bot_id', String(botID));
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));

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