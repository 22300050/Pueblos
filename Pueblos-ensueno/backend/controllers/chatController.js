import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee prompt con fallback (backend/prompt.json o raíz del repo)
function loadPrompt() {
  const p1 = path.join(__dirname, "..", "prompt.json");
  const p2 = path.join(__dirname, "..", "..", "prompt.json");
  for (const p of [p1, p2]) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  }
  return {
    name: "Tavo Explorador",
    role: "Asistente cultural y turístico",
    style: { tone: "amigable, claro, inclusivo" },
  };
}
const promptData = loadPrompt();

const MODEL = "gemini-1.5-flash-latest";

// --- extractor robusto de texto de Gemini ---
const pickText = (d) => {
  if (!d) return "";
  const parts = d?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts) && parts.length) {
    const txt = parts
      .map((p) => {
        if (typeof p?.text === "string") return p.text;
        if (p?.inlineData?.data && p?.inlineData?.mimeType?.startsWith("text/")) {
          try { return Buffer.from(p.inlineData.data, "base64").toString("utf-8"); } catch {}
        }
        return "";
      })
      .join("")
      .trim();
    if (txt) return txt;
  }
  const g = d?.candidates?.[0]?.groundingAttributions?.[0]?.content?.parts;
  if (Array.isArray(g) && g.length) {
    const txt = g.map((p) => p?.text || "").join("").trim();
    if (txt) return txt;
  }
  const block = d?.promptFeedback?.blockReason;
  if (block) return `No puedo responder esa petición (bloqueado por política: ${block}).`;
  return "";
};

export const chatController = async (req, res) => {
  try {
    const { messages = [] } = req.body;

    const body = {
      // 👇 IMPORTANTE: Gemini espera "parts" (no "content") aquí
      system_instruction: {
        role: "system",
        parts: [{ text: JSON.stringify(promptData) }],
      },
      generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 512 },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    };

    console.log("🔑 GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "PRESENTE" : "FALTA");
    console.log("➡️ Body hacia Gemini:", JSON.stringify(body).slice(0, 800), "...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    console.log("⬅️ Gemini status:", r.status);

    if (!r.ok) {
      console.error("❌ Gemini error payload:", raw);
      return res.status(500).json({ error: "Gemini_error", detail: raw });
    }

    let data = {};
    try { data = JSON.parse(raw); }
    catch {
      console.error("❌ No pude parsear JSON de Gemini:", raw);
      return res.status(500).json({ error: "Gemini_bad_json", detail: raw });
    }

    const reply = pickText(data);
    if (!reply) {
      console.warn("⚠️ Respuesta sin texto útil de Gemini:", JSON.stringify(data).slice(0, 1200));
      return res.status(200).json({ reply: "" }); // el front hará fallback local
    }

    return res.json({ reply }); // 👈 solo una vez
  } catch (err) {
    console.error("💥 server_error:", err);
    return res.status(500).json({ error: "server_error", detail: String(err) });
  }
};
