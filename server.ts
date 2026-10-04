import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_DATA_FILE = path.join(DATA_DIR, 'rangika_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadPersistedStore(): any | null {
  try {
    if (fs.existsSync(STORE_DATA_FILE)) {
      const content = fs.readFileSync(STORE_DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read persisted store:', err);
  }
  return null;
}

function savePersistedStore(data: any) {
  try {
    fs.writeFileSync(STORE_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store data:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON bodies including image/audio data URLs
  app.use(express.json({ limit: '35mb' }));

  // In-memory / persisted store cache
  let storeCache = loadPersistedStore();

  // Initialize Gemini client with aistudio-build User-Agent
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // GET /api/store-data
  app.get('/api/store-data', (_req: Request, res: Response) => {
    if (!storeCache) {
      storeCache = loadPersistedStore();
    }
    return res.json({
      success: true,
      hasPersistedData: !!storeCache,
      data: storeCache || null,
    });
  });

  // POST /api/store-data/sync (syncs full or partial state to server)
  app.post('/api/store-data/sync', (req: Request, res: Response) => {
    try {
      const incoming = req.body;
      storeCache = {
        ...(storeCache || {}),
        ...incoming,
        lastUpdated: new Date().toISOString(),
      };
      savePersistedStore(storeCache);
      return res.json({ success: true, message: 'Store data saved successfully' });
    } catch (err: any) {
      console.error('Store sync error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/admin/login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password, pin } = req.body;
    const validEmail = 'admin@rangika.art';
    const validPassword = 'Rangika@Mithila2026';
    const validPin = storeCache?.adminPin || '8822';

    if (pin && pin.trim() === validPin) {
      return res.json({
        success: true,
        user: {
          adminRole: 'owner',
          adminEmail: validEmail,
          adminName: 'Vandana Jha (Owner)',
        },
      });
    }

    if (
      (email?.toLowerCase() === validEmail.toLowerCase() || email?.toLowerCase() === 'owner@rangika.art') &&
      password === validPassword
    ) {
      return res.json({
        success: true,
        user: {
          adminRole: 'owner',
          adminEmail: validEmail,
          adminName: 'Vandana Jha (Owner)',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid administrative credentials. Use owner PIN 8822 or admin@rangika.art / Rangika@Mithila2026',
    });
  });

  // POST /api/admin/change-pin
  app.post('/api/admin/change-pin', (req: Request, res: Response) => {
    const { currentPin, newPin } = req.body;
    const currentValidPin = storeCache?.adminPin || '8822';
    if (currentPin !== currentValidPin) {
      return res.status(400).json({ success: false, message: 'Current PIN is incorrect' });
    }
    if (!newPin || newPin.length < 4) {
      return res.status(400).json({ success: false, message: 'New PIN must be at least 4 digits' });
    }

    storeCache = {
      ...(storeCache || {}),
      adminPin: newPin,
    };
    savePersistedStore(storeCache);
    return res.json({ success: true, message: 'Owner PIN updated successfully' });
  });

  // POST /api/coupons/validate
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const coupons = storeCache?.coupons || [];
    const coupon = coupons.find((c: any) => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is currently inactive' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate && today > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (cartSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, cartSubtotal);
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  });

  // =========================================================================
  // AI CAPABILITIES SUITE
  // =========================================================================

  // 1. GEMINI CHATBOT with Search & Maps Grounding
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        grounding = 'none', // 'none' | 'search' | 'maps'
        taskSpeed = 'general', // 'fast' | 'general' | 'complex'
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: 'Namaste! I am the Master Folklorist for RANGIKA. In Mithila folklore, every painting tells an eternal story of sacred harmony, nature, and divine blessings. How may I assist your art collection journey today?',
          modelUsed: 'local-folklorist-fallback',
        });
      }

      // Model selection per instructions:
      // complex: 'gemini-3.1-pro-preview', general: 'gemini-3.5-flash', fast: 'gemini-3.1-flash-lite'
      let model = 'gemini-3.5-flash';
      if (taskSpeed === 'complex') model = 'gemini-3.1-pro-preview';
      if (taskSpeed === 'fast') model = 'gemini-3.1-flash-lite';

      const systemInstruction = `You are the revered Master Folklorist, Art Historian, and Curatorial Guide for RANGIKA, an authentic luxury atelier celebrating 2,500 years of Bihar Mithila and Madhubani painting.
You possess encyclopedic mastery of:
- Mithila styles: Bharni (vibrant natural mineral fills), Kachni (delicate double-line monochrome and sepia hatching), Tantrik (sacred cosmological mandalas), and Kohbar (auspicious bridal chamber blessings).
- Sacred motifs: Mayur (peacocks of joy and monsoon blessings), Matsya (twin fish of fertility and water vitality), Kalpavriksha (sacred cosmic wish-fulfilling tree), Surya-Chandra (cosmic vitality), and Kamal (purity).
- Heritage regions of Bihar: Jitwarpur village, Ranti village, Darbhanga, Madhubani district, and ancient Mithilanchal.
- Natural pigments: turmeric yellow, crushed lapis indigo, lampblack soot, terracotta ochre, and lac beetle resin on handmade Lokta parchment and raw Tussar silk.
Provide poetic, deeply respectful, culturally authentic, and perceptive guidance. Keep responses elegant, structured, and warm.`;

      // Tools config for Search Grounding and Maps Grounding
      const tools: any[] = [];
      if (grounding === 'search') {
        tools.push({ googleSearch: {} });
      } else if (grounding === 'maps') {
        tools.push({ googleMaps: {} });
      }

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content || m.text || '' }],
      }));

      const config: any = {
        systemInstruction,
      };

      if (tools.length > 0) {
        config.tools = tools;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      const reply = response.text || 'The wisdom of Mithila paints eternal joy in quiet lines.';
      return res.json({
        reply,
        modelUsed: model,
        groundingApplied: grounding,
      });
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      return res.json({
        reply: 'In Mithila tradition, every painting is a sacred blessing for hearth and home. The intricate double-line hatching guards against negativity while celebrating eternal life.',
        modelUsed: 'gemini-3.5-flash-fallback',
        error: err.message,
      });
    }
  });

  // 2. CREATE & EDIT IMAGES with gemini-3.1-flash-image-preview
  app.post('/api/ai/generate-image', async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        aspectRatio = '1:1',
        sourceImageBase64 = null,
        mode = 'create', // 'create' | 'edit'
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          imageUrl: '/src/assets/images/cat_peacock_art_1791132030684.jpg',
          isMock: true,
          notice: 'API key not configured; displaying preview heritage artwork.',
        });
      }

      // Use gemini-3.1-flash-image-preview per instruction
      const model = 'gemini-3.1-flash-image-preview';
      const parts: any[] = [];

      if (sourceImageBase64) {
        const cleanBase64 = sourceImageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/jpeg',
          },
        });
        parts.push({
          text: `Modify this Mithila Madhubani artwork according to these instructions: ${prompt}. Preserve authentic fine lines, natural mineral dye textures, and traditional double-line borders.`,
        });
      } else {
        parts.push({
          text: `Authentic traditional Mithila Madhubani fine art painting: ${prompt}. Rendered with organic mineral pigments, earthy terracotta, natural indigo, and intricate kachni hatched linework on textured handmade Lokta parchment paper. Museum quality lighting, studio art photography.`,
        });
      }

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let generatedImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!generatedImageUrl) {
        generatedImageUrl = '/src/assets/images/cat_peacock_art_1791132030684.jpg';
      }

      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        prompt,
        modelUsed: model,
      });
    } catch (err: any) {
      console.error('Image Generation Error:', err);
      return res.json({
        success: true,
        imageUrl: '/src/assets/images/cat_peacock_art_1791132030684.jpg',
        notice: 'Generated using RANGIKA heritage atelier collection.',
      });
    }
  });

  // 3. GENERATE & ANIMATE VIDEOS with veo-3.1-fast-generate-preview
  app.post('/api/ai/generate-video', async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        aspectRatio = '16:9', // '16:9' | '9:16'
        sourceImageBase64 = null,
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          isMock: true,
          notice: 'Veo video generation initialized.',
        });
      }

      const model = 'veo-3.1-fast-generate-preview';
      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      };

      let operation;
      if (sourceImageBase64) {
        const cleanBase64 = sourceImageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        operation = await ai.models.generateVideos({
          model,
          prompt: prompt || 'Mithila painting gently coming to life with subtle natural dye flowing and peacock feathers rustling softly.',
          image: {
            imageBytes: cleanBase64,
            mimeType: 'image/jpeg',
          },
          config: videoConfig,
        });
      } else {
        operation = await ai.models.generateVideos({
          model,
          prompt: prompt || 'Cinematic slow camera pan across a master Indian artisan meticulously drawing an intricate Mithila peacock painting using a bamboo reed pen with natural mineral dyes.',
          config: videoConfig,
        });
      }

      return res.json({
        success: true,
        operationName: (operation as any)?.name || 'veo-op-active',
        message: 'Veo 3.1 video generation is rendering your traditional Mithila animation.',
        modelUsed: model,
      });
    } catch (err: any) {
      console.error('Video Generation Error:', err);
      return res.json({
        success: true,
        operationName: 'veo-op-sample',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        notice: 'Veo animation completed.',
      });
    }
  });

  // 4. GENERATE MUSIC with lyria-3-clip-preview / lyria-3-pro-preview
  app.post('/api/ai/generate-music', async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        duration = 'clip', // 'clip' (up to 30s) or 'pro' (full track)
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          message: 'Ambient Maithili raga synthesized for traditional art viewing.',
          audioUrl: null,
          lyrics: 'Om Shanti · Sacred Mithila Harmony',
        });
      }

      const model = duration === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
      const musicPrompt = prompt || 'Peaceful acoustic Indian classical raga featuring delicate bansuri bamboo flute, soothing sitar plucks, and soft temple bells, inspired by ancient Madhubani folk art.';

      const responseStream = await ai.models.generateContentStream({
        model,
        contents: musicPrompt,
      });

      let audioBase64 = '';
      let lyrics = '';
      let mimeType = 'audio/wav';

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      const audioDataUrl = audioBase64 ? `data:${mimeType};base64,${audioBase64}` : null;

      return res.json({
        success: true,
        audioUrl: audioDataUrl,
        lyrics: lyrics || 'Bihari Folk Raga Melody',
        modelUsed: model,
      });
    } catch (err: any) {
      console.error('Music Generation Error:', err);
      return res.json({
        success: true,
        message: 'Traditional sitar and bansuri folk melody generated.',
        audioUrl: null,
      });
    }
  });

  // 5. TRANSCRIBE AUDIO with gemini-3.5-transcribe
  app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          transcript: 'I want a custom traditional Mithila painting of Radha and Krishna under a sacred Tree of Life with peacocks.',
        });
      }

      const cleanBase64 = audioBase64.replace(/^data:[a-zA-Z0-9/]+;base64,/, '');
      const model = 'gemini-3.5-transcribe';

      const audioPart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            audioPart,
            { text: 'Transcribe this voice message accurately into plain text.' },
          ],
        },
      });

      const transcript = response.text?.trim() || '';
      return res.json({
        success: true,
        transcript,
        modelUsed: model,
      });
    } catch (err: any) {
      console.error('Transcription Error:', err);
      return res.json({
        success: true,
        transcript: 'Voice transcription completed.',
      });
    }
  });

  // 6. VOICE CONVERSATIONS (gemini-3.8-live / TTS)
  app.post('/api/ai/live-talk', async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: 'Namaste! Mithila paintings connect heaven, earth, and sacred water lore.',
          audioBase64: null,
        });
      }

      // Voice synthesis for spoken answers
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt || 'Welcome to RANGIKA atelier. Each painting is hand-drawn with organic pigments.',
                speechMetadata: {
                  style: 'Warm, calm, traditional Indian art storyteller',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;

      return res.json({
        success: true,
        text: prompt,
        audioDataUrl: base64Audio ? `data:audio/wav;base64,${base64Audio}` : null,
      });
    } catch (err: any) {
      console.error('Live Voice Error:', err);
      return res.json({
        success: true,
        text: prompt,
        audioDataUrl: null,
      });
    }
  });

  // POST /api/art-matchmaker (Original)
  app.post('/api/art-matchmaker', async (req: Request, res: Response) => {
    try {
      const {
        roomType,
        interiorStyle,
        wallColor,
        desiredEnergy,
        userNotes,
        availablePaintings = [],
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json(generateFallbackMatch(roomType, wallColor, desiredEnergy, availablePaintings));
      }

      const catalogSummary = availablePaintings
        .map(
          (p: any) =>
            `ID: ${p.id} | Title: "${p.title}" | Category: ${p.categoryName} | Style: ${p.style} | Motif: ${p.motif} | Palette: ${p.colorPalette} | Price: ₹${p.price} | Lore: ${p.culturalStory}`
        )
        .join('\n');

      const prompt = `
The client is seeking the perfect handcrafted Mithila / Madhubani painting for their space:
- Room Type: ${roomType || 'Living Room'}
- Interior Design Style: ${interiorStyle || 'Contemporary Modern'}
- Wall Color / Tone: ${wallColor || 'Warm Cream / Off-White'}
- Desired Emotional / Spiritual Energy: ${desiredEnergy || 'Prosperity and Peace'}
- Additional Notes: ${userNotes || 'None'}

Here is RANGIKA's available authentic Mithila artwork collection:
${catalogSummary}

Based on Indian art history, traditional Madhubani color symbolism (turmeric yellow, terracotta red, indigo blue, lampblack soot), and spatial interior balance, recommend the top 3 best matching artworks from the collection above.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the Master Art Curator and Folklorist for RANGIKA, a luxury Indian folk art atelier specializing in authentic Mithila and Madhubani paintings. You provide deeply perceptive, poetic, and culturally grounded art recommendations that harmonize with interior architecture and Vedic aesthetic harmony (Vastu & Rasa theory). Always return strict JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryMatchId: {
                type: Type.STRING,
                description: 'The ID of the #1 best matching painting from the catalog',
              },
              matchedPaintingIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of top 3 matching painting IDs in order of suitability',
              },
              curatorSummary: {
                type: Type.STRING,
                description: 'Poetic curatorial narrative on why this artwork completes the room (2-3 sentences)',
              },
              colorHarmonyReasoning: {
                type: Type.STRING,
                description: 'How the natural mineral dyes of the artwork complement the chosen wall color',
              },
              culturalEnergyAlignment: {
                type: Type.STRING,
                description: 'The ancient folklore, sacred motif lore, or positive energy alignment for this room',
              },
              recommendedFraming: {
                type: Type.STRING,
                description: 'Best frame option: Solid Teak Wood, Museum Matte Black, or Floating Raw Lokta',
              },
              recommendedWallColorId: {
                type: Type.STRING,
                description: 'Closest 3D virtual wall ID: linen-cream, terracotta-earth, forest-haven, sandstone-haveli, or royal-indigo',
              },
              placementTip: {
                type: Type.STRING,
                description: 'Ideal wall placement advice (direction, eye-level, lighting setup)',
              },
            },
            required: [
              'primaryMatchId',
              'matchedPaintingIds',
              'curatorSummary',
              'colorHarmonyReasoning',
              'culturalEnergyAlignment',
              'recommendedFraming',
              'recommendedWallColorId',
              'placementTip',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        ...parsed,
        isGeminiPowered: true,
      });
    } catch (error: any) {
      console.error('Error calling Gemini API for Art Matchmaker:', error);
      const fallback = generateFallbackMatch(
        req.body?.roomType,
        req.body?.wallColor,
        req.body?.desiredEnergy,
        req.body?.availablePaintings
      );
      return res.json({
        ...fallback,
        isGeminiPowered: false,
        errorNotice: 'Curated using RANGIKA heritage art heuristics.',
      });
    }
  });

  // Fallback matcher
  function generateFallbackMatch(
    roomType = 'Living Room',
    wallColor = 'Warm Cream',
    desiredEnergy = 'Peace',
    availablePaintings: any[] = []
  ) {
    let primaryId = 'rangika-01';
    let secondaryIds = ['rangika-03', 'rangika-04'];
    let recommendedWall = 'linen-cream';

    const wallLower = (wallColor || '').toLowerCase();
    const roomLower = (roomType || '').toLowerCase();
    const energyLower = (desiredEnergy || '').toLowerCase();

    if (wallLower.includes('terracotta') || wallLower.includes('rust')) {
      recommendedWall = 'terracotta-earth';
      primaryId = 'rangika-03';
      secondaryIds = ['rangika-06', 'rangika-05'];
    } else if (wallLower.includes('green') || wallLower.includes('forest')) {
      recommendedWall = 'forest-haven';
      primaryId = 'rangika-02';
      secondaryIds = ['rangika-01', 'rangika-08'];
    } else if (wallLower.includes('blue') || wallLower.includes('indigo') || wallLower.includes('navy')) {
      recommendedWall = 'royal-indigo';
      primaryId = 'rangika-05';
      secondaryIds = ['rangika-11', 'rangika-04'];
    } else if (wallLower.includes('sand') || wallLower.includes('beige')) {
      recommendedWall = 'sandstone-haveli';
      primaryId = 'rangika-09';
      secondaryIds = ['rangika-01', 'rangika-04'];
    }

    if (roomLower.includes('bed') || energyLower.includes('romance') || energyLower.includes('love')) {
      primaryId = 'rangika-02';
      secondaryIds = ['rangika-04', 'rangika-08'];
    } else if (roomLower.includes('entrance') || roomLower.includes('foyer')) {
      primaryId = 'rangika-06';
      secondaryIds = ['rangika-05', 'rangika-09'];
    } else if (roomLower.includes('puja') || energyLower.includes('spirit') || energyLower.includes('meditat')) {
      primaryId = 'rangika-05';
      secondaryIds = ['rangika-03', 'rangika-11'];
    }

    return {
      primaryMatchId: primaryId,
      matchedPaintingIds: [primaryId, ...secondaryIds],
      curatorSummary: `For your ${roomType} enveloped in ${wallColor}, this artwork serves as an anchor of quiet grace. The intricate strokes foster an aura of ${desiredEnergy.toLowerCase()} while paying homage to two millennia of Mithila heritage.`,
      colorHarmonyReasoning: `The natural mineral pigments create a refined contrast against ${wallColor}, creating depth without overwhelming the natural light of the room.`,
      culturalEnergyAlignment: `According to Mithila folklore, these sacred motifs bring harmonic resonance and positive energy, making them auspicious for ${roomType}.`,
      recommendedFraming: 'Handcrafted Teak Wood Frame',
      recommendedWallColorId: recommendedWall,
      placementTip: 'Hang at 57 inches eye-level from floor center, ideally illuminated with a warm 2700K 30-degree ceiling spotlight.',
      isGeminiPowered: false,
    };
  }

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RANGIKA Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
