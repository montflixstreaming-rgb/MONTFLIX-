import { GoogleGenAI } from "@google/genai";
import { Movie } from "./types";

export const getMovieRecommendation = async (userInput: string, movieCatalog: Movie[], language: string) => {
  try {
    // Tenta ler a chave injetada pelo processo de build
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      return language === 'pt' 
        ? "Oi! Aqui é o Alex. A chave 'API_KEY' ainda não foi detectada pelo sistema. Certifique-se de salvá-la no painel do Netlify (Environment Variables) e fazer um novo deploy para ativar minha inteligência!"
        : "Hi! Alex here. The 'API_KEY' has not been detected yet. Please save it in the Netlify panel and redeploy to activate my AI!";
    }

    const ai = new GoogleGenAI({ apiKey });
    const catalogTitles = movieCatalog.map(m => `- ${m.title} (${m.category})`).join("\n");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ 
        parts: [{ 
          text: `Você é o Alex, curador oficial da MONTFLIX. Seu objetivo é ajudar o usuário a escolher um filme deste catálogo:
          ${catalogTitles}
          
          O usuário disse: "${userInput}"
          
          Responda com entusiasmo, use termos técnicos de cinema, seja amigável e responda em ${language === 'pt' ? 'Português' : 'Inglês'}.` 
        }] 
      }],
    });

    return response.text || "Estou pronto para indicar o melhor filme do nosso catálogo grátis!";
  } catch (error) {
    console.error("Erro no Alex:", error);
    return "Tive um pequeno contratempo na rede. Pode tentar perguntar novamente?";
  }
};