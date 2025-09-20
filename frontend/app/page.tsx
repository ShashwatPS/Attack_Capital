"use client";

import { useState, useEffect } from "react";

interface Bot {
  uid: string;
  name: string;
  prompt: string;
  first_message: string;
  post_call_settings?: {
    summary_prompt: string;
  };
}

export default function Home() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    prompt: "",
    first_message: "",
    summary_prompt: ""
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchBots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bot/list`);
      const data = await response.json();
      setBots(data.bots || []);
    } catch (error) {
      console.error("Failed to fetch bots:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/bot/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: "", prompt: "", first_message: "", summary_prompt: "" });
        setShowCreateForm(false);
        fetchBots();
      }
    } catch (error) {
      console.error("Failed to create bot:", error);
    }
  };

  const updateBot = async (e: React.FormEvent, uid: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/bot/update/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setBots(bots.map(bot => 
          bot.uid === uid 
            ? { 
                ...bot, 
                name: formData.name, 
                prompt: formData.prompt, 
                first_message: formData.first_message,
                post_call_settings: { summary_prompt: formData.summary_prompt }
              }
            : bot
        ));
        setEditingBot(null);
        setFormData({ name: "", prompt: "", first_message: "", summary_prompt: "" });
      }
    } catch (error) {
      console.error("Failed to update bot:", error);
    }
  };

  const deleteBot = async (uid: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bot/delete/${uid}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setBots(bots.filter(bot => bot.uid !== uid));
      }
    } catch (error) {
      console.error("Failed to delete bot:", error);
    }
  };

  const startEditing = (bot: Bot) => {
    setEditingBot(bot.uid);
    setFormData({
      name: bot.name,
      prompt: bot.prompt,
      first_message: bot.first_message,
      summary_prompt: bot.post_call_settings?.summary_prompt || ""
    });
  };

  const cancelEditing = () => {
    setEditingBot(null);
    setFormData({ name: "", prompt: "", first_message: "", summary_prompt: "" });
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Attack Capital</h1>
          <p className="text-black">Bot Management Dashboard</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {showCreateForm ? "Cancel" : "Create New Bot"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Create New Bot</h2>
            <form onSubmit={createBot} className="space-y-4">
              <input
                type="text"
                placeholder="Bot Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border rounded-lg text-black placeholder-black"
                required
              />
              <textarea
                placeholder="Bot Prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full p-3 border rounded-lg h-24 text-black placeholder-black"
                required
              />
              <input
                type="text"
                placeholder="First Message"
                value={formData.first_message}
                onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
                className="w-full p-3 border rounded-lg text-black placeholder-black"
                required
              />
              <textarea
                placeholder="Summary Prompt"
                value={formData.summary_prompt}
                onChange={(e) => setFormData({ ...formData, summary_prompt: e.target.value })}
                className="w-full p-3 border rounded-lg h-24 text-black placeholder-black"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Create Bot
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-black">Your Bots</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-black">Loading...</div>
          ) : bots.length === 0 ? (
            <div className="p-6 text-center text-black">No bots found</div>
          ) : (
            <div className="divide-y">
              {bots.map((bot) => (
                <div key={bot.uid} className="p-6">
                  {editingBot === bot.uid ? (
                    <form onSubmit={(e) => updateBot(e, bot.uid)} className="space-y-4">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border rounded-lg text-black"
                        required
                      />
                      <textarea
                        value={formData.prompt}
                        onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                        className="w-full p-3 border rounded-lg h-24 text-black"
                        required
                      />
                      <input
                        type="text"
                        value={formData.first_message}
                        onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
                        className="w-full p-3 border rounded-lg text-black"
                        required
                      />
                      <textarea
                        placeholder="Summary Prompt"
                        value={formData.summary_prompt}
                        onChange={(e) => setFormData({ ...formData, summary_prompt: e.target.value })}
                        className="w-full p-3 border rounded-lg h-24 text-black placeholder-black"
                        required
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-black">{bot.name}</h3>
                        <p className="text-black mt-1 mb-2">{bot.first_message}</p>
                        <div className="text-sm text-black space-y-1">
                          <p><span className="font-medium">Prompt:</span> {bot.prompt.substring(0, 100)}...</p>
                          <p><span className="font-medium">Summary Prompt:</span> {bot.post_call_settings?.summary_prompt?.substring(0, 100) || 'Not set'}...</p>
                          <p><span className="font-medium">ID:</span> {bot.uid}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => startEditing(bot)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBot(bot.uid)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
