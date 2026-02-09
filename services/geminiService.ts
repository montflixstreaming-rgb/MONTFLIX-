import { GoogleGenAI } from "@google/genai";
import { Movie } from "./types";

export const getMovieRecommendation = async (userInput: string, movieCatalog: Movie[], language: string) => {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return language === 'pt' 
        ? "Oi! Aqui é o Alex. Notei que a sua API_KEY não foi detectada. Verifique se você adicionou 'API_KEY' nas variáveis de ambiente do Netlify e reiniciou o deploy."
        : "Hi! Alex here. Your API_KEY was not detected. Please check your Netlify environment variables.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const catalogTitles = movieCatalog.map(m => `- ${m.title} (${m.category})`).join("\n");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ 
        parts: [{ 
          text: `Você é o Alex, curador da MONTFLIX. Ajude o usuário com o catálogo: ${catalogTitles}. O usuário disse: ${userInput}. Responda de forma cinéfila e empolgada em ${language === 'pt' ? 'Português' : 'Inglês'}.` 
        }] 
      }],
    });

    return response.text || "Estou pronto para indicar o melhor filme!";
  } catch (error) {
    console.error("Erro Alex:", error);
    return "Tive um problema na conexão. Pode repetir?";
  }
};