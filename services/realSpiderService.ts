
import { GoogleGenAI } from "@google/genai";
import { Movie } from "./types";
import { tmdbService } from "./tmdbService";

export interface SpiderResponse {
  movies: Movie[];
  sources: { title: string; uri: string }[];
}

export const realSpiderService = {
  async scanForNewReleases(): Promise<SpiderResponse> {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      throw new Error("A chave de API (Gemini) não foi detectada. Configure a API_KEY no seu ambiente de hospedagem.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Prompt extremamente específico para forçar o uso da ferramenta Google Search
    const prompt = `Utilize o Google Search para encontrar os 8 filmes mais aguardados ou recém-lançados nos cinemas e streamings (Netflix, Max, Disney+) no Brasil em FEVEREIRO de 2025.
    Eu preciso de dados reais e atualizados hoje.
    Retorne o resultado estritamente em JSON, no formato:
    {
      "movies": [
        {"title": "Nome exato do filme", "year": 2025}
      ]
    }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          temperature: 0.2, 
        },
      });

      // Captura as fontes REAIS de onde o robô tirou a informação (Grounding)
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "Portal de Cinema",
          uri: chunk.web.uri
        }));

      let rawJson = response.text || '{"movies": []}';
      // Limpeza de segurança para garantir que o parse funcione
      rawJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedData = JSON.parse(rawJson);
      const foundTitles = parsedData.movies || [];
      const completeMovies: Movie[] = [];

      // Sincronização em massa com posters oficiais via TMDB
      for (const item of foundTitles) {
        const results = await tmdbService.search(item.title);
        if (results && results.length > 0) {
          // Pega o primeiro resultado válido
          completeMovies.push(results[0]);
        }
      }

      return {
        movies: completeMovies,
        sources: sources.slice(0, 12)
      };
    } catch (error: any) {
      console.error("Erro no motor Spider Gemini:", error);
      throw error;
    }
  }
};
