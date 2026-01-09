
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchQuizQuestion = async (difficulty: string, excludedQuestions: string[]): Promise<QuizQuestion> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Você é um gerador de perguntas para o quiz "Quem Quer Ser Milionário - Moçambique". 
  Gere uma pergunta de nível ${difficulty} sobre Moçambique.
  Evite estas perguntas já feitas: ${excludedQuestions.join(', ')}.
  
  Temas permitidos: História, Geografia, Cultura, Línguas, Independência, Política, Economia, Recursos Naturais, Música, Desporto e Personalidades de Moçambique.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nivel: { type: Type.STRING, description: "Fácil | Médio | Difícil" },
          pergunta: { type: Type.STRING },
          opcoes: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING },
              B: { type: Type.STRING },
              C: { type: Type.STRING },
              D: { type: Type.STRING }
            },
            required: ["A", "B", "C", "D"]
          },
          resposta_correta: { type: Type.STRING, description: "Letra A, B, C ou D" },
          explicacao: { type: Type.STRING }
        },
        required: ["nivel", "pergunta", "opcoes", "resposta_correta", "explicacao"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as QuizQuestion;
  } catch (error) {
    console.error("Erro ao analisar resposta da IA", error);
    throw new Error("Falha ao gerar pergunta.");
  }
};

export const getLifelineHelp = async (type: 'public' | 'friend', question: QuizQuestion): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = type === 'public' 
    ? `Dê uma estimativa de porcentagem para cada opção (A, B, C, D) para a pergunta: "${question.pergunta}". A resposta correta é ${question.resposta_correta}. O público geralmente acerta questões fáceis mas pode errar as difíceis.`
    : `Aja como um amigo sendo consultado por telefone no jogo Milionário. Dê uma dica sutil mas útil para a pergunta: "${question.pergunta}". Não diga a resposta diretamente, mas guie o jogador.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  return response.text || "Desculpe, a conexão falhou.";
};
