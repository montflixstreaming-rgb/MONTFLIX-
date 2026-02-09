
import { GoogleGenAI } from "@google/genai";
import { Movie } from "./types";

export const getMovieRecommendation = async (userInput: string, movieCatalog: Movie[], language: string) => {
  try {
    // Inicialização correta usando objeto nomeado para a chave de API
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const catalogStr = movieCatalog.map(m => m.title).join(", ");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Pergunta: "${userInput}". Catálogo: ${catalogStr}. Responda como Alex (curador MONTFLIX) em ${language === 'pt' ? 'Português' : 'Inglês'}.`,
      config: {
        systemInstruction: "Você é o Alex, especialista de suporte e curador oficial da MONTFLIX Pro. Seja moderno, cinéfilo e educado. Recomende filmes do catálogo ou ajude com problemas técnicos de forma empática.",
      }
    });

    return response.text || "Estou processando sua solicitação...";
  } catch (error) {
    console.error("Erro na IA Alex:", error);
    return "Oi! Aqui é o Alex. Tivemos um erro de conexão, mas estou pronto para ajudar novamente!";
  }
};
