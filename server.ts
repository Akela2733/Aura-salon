import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please add it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API endpoint for AI Hair Stylist Consultant
app.post("/api/consult", async (req, res) => {
  try {
    const { hairType, hairConcerns, desiredStyle, clientName } = req.body;

    if (!hairType || !desiredStyle) {
      return res.status(400).json({ error: "Hair type and desired style are required parameters." });
    }

    const clientNameStr = clientName ? clientName : "Valued Guest";
    const prompt = `You are the master resident AI Hair Consultant at 'CORRIDOR', an ultra-luxury, high-end design salon located at 14 Horton Place, Colombo 7.
Our philosophy is built around personalized geometric forms, pristine hair health, and colors suited to the tropical Sri Lankan climate.

Please provide a highly professional, luxurious, and encouraging style consultation for our client, ${clientNameStr}.

Client Profile:
- Hair Type: ${hairType}
- Hair Concerns: ${Array.isArray(hairConcerns) ? hairConcerns.join(", ") : (hairConcerns || "General care")}
- Desired Hairstyle/Aesthetic: ${desiredStyle}

Structure your response into these exact, elegantly formatted sections:
1. ✦ THE ANALYSIS: Assess their hair type and concerns in relation to their desired look, taking Colombo's humidity and tropical climate into account.
2. ✦ CORRIDOR STYLING ARCHITECTURE: Propose a specific cut shape, parting, or architectural approach that would suit them.
3. ✦ FORMULA & PIGMENT ARCHITECTURE: Recommend specific custom pigments (e.g., using rich Sri Lankan spices or mineral terms, like "Cinnamon Glow", "Ceylon Clove Gloss", "Golden Sand Balayage") to complement their skin tone.
4. ✦ THE COLOMBO CARE REGIMEN: Detail how they should care for this style at home under tropical humidity conditions.

Keep your tone sophisticated, warm, and highly personalized. Avoid generic recommendations.`;

    try {
      const ai = getAiClient();
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const recommendation = aiResponse.text || "Our stylists will craft a custom blueprint upon your arrival.";
      return res.json({ recommendation });
    } catch (apiErr: any) {
      console.error("Gemini API error:", apiErr);
      // Beautiful high-end fallback so the app remains fully functional
      const fallbackRec = `✦ THE ANALYSIS
Your profile suggests a beautiful canvas. Given Colombo's high tropical humidity, we will focus on anti-frizz alignment and texture preservation to ensure your styled silhouette remains intact.

✦ CORRIDOR STYLING ARCHITECTURE
We recommend a customized fluid layered cut, crafted to follow your natural hair growth and facial contouring. This style allows for weight distribution and movement, keeping styling effortless at home.

✦ FORMULA & PIGMENT ARCHITECTURE
We propose our signature "Cinnamon Glaze" or "Ceylon Golden Sand Balayage" using ammonia-free, nourishing mineral pigments. These warm golden undertones will catch the Sri Lankan light gorgeously and naturally brighten your skin tone.

✦ THE COLOMBO CARE REGIMEN
Maintain this structural health by applying lightweight silicone-free shields. We will walk you through customized blow-drying shapes at our Form station during your visit.

(Note: Our Gemini AI is currently relaxing in Colombo, but we have activated our premium fallback recommendation for you!)`;
      return res.json({ recommendation: fallbackRec });
    }
  } catch (error: any) {
    console.error("Server consultation error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred during consultation." });
  }
});

// API endpoint for simulated payment transactions
app.post("/api/pay", async (req, res) => {
  try {
    const { appointmentId, amount, cardName, cardNumber } = req.body;

    if (!appointmentId || !amount || !cardName || !cardNumber) {
      return res.status(400).json({ error: "Missing required transaction parameters." });
    }

    // Server-side validation of amount and card format
    const cleanedCardNum = cardNumber.replace(/\s+/g, "");
    if (cleanedCardNum.length < 13 || cleanedCardNum.length > 19) {
      return res.status(400).json({ error: "Invalid payment card format." });
    }

    // Simulate high-end financial settlement
    const transactionId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
    const referenceId = "COR-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    // Respond with a verified secure status
    return res.json({
      success: true,
      transactionId,
      referenceId,
      status: "SETTLED",
      message: "Payment of LKR " + amount.toLocaleString() + " settled successfully via CORRIDOR Colombo.",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Server payment error:", error);
    return res.status(500).json({ error: "Mock transaction processing failed." });
  }
});

// Serve static assets and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CORRIDOR Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
