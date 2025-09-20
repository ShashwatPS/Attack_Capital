import type { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

export const createBot = async (req: Request, res: Response) => {
  const apiKey = process.env.OPENMIC_API_KEY; 

  const { name, prompt, first_message, summary_prompt } = req.body;

  const url = 'https://api.openmic.ai/v1/bots'; 

  if (!apiKey) {
    return res.status(500).json({ error: "OpenMic API key not configured" });
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "name": name,
        "prompt": prompt,
        "first_message": first_message,
        "post_call_settings": {
            "summary_prompt": summary_prompt,
            "success_evaluation_prompt": "Rate the success of this call on a scale of 1-10 based on customer satisfaction.",
            "success_evaluation_rubric_type": "NUMERIC_SCALE"
        }
    }),
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

export const deleteBot = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const apiKey = process.env.OPENMIC_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenMic API key not set' });
  }

  const url = `https://api.openmic.ai/v1/bots/${uid}`;
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    res.json({message: "Successfully deleted"});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const listBots = async (req: Request, res: Response) => {
  const apiKey = process.env.OPENMIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenMic API key not configured' });
  }

  const pageNo = Number(req.query.page) || 1;
  const limit = 10;

  const offset = (pageNo - 1) * limit;

  const url = new URL('https://api.openmic.ai/v1/bots');
  url.searchParams.append('limit', String(limit));
  url.searchParams.append('offset', String(offset));

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(url.toString(), options);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'OpenMic responded with error', details: text });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Error fetching bots from OpenMic', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBot = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const apiKey = process.env.OPENMIC_API_KEY; 

  const { name, prompt, first_message, summary_prompt } = req.body;

  const url = `https://api.openmic.ai/v1/bots/${uid}`; 

  if (!apiKey) {
    return res.status(500).json({ error: "OpenMic API key not configured" });
  }

  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      prompt: prompt,
      first_message: first_message,
      post_call_settings: {
        summary_prompt: summary_prompt,
        success_evaluation_prompt: "Rate the success of this call on a scale of 1-10 based on customer satisfaction.",
        success_evaluation_rubric_type: "NUMERIC_SCALE",
      },
    }),
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