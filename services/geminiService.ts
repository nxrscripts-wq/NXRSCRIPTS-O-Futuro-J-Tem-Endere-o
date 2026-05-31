import { supabase } from '../lib/supabase';

// Função auxiliar que chama a Edge Function ai-analyze
async function callAI(type: 'insight' | 'categorize' | 'chat', payload: string | object): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-analyze', {
    body: {
      type,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
    },
  });

  if (error) {
    console.error('[geminiService] Edge function error:', error);
    throw error;
  }

  if (!data?.result) {
    throw new Error('No result from AI');
  }

  return data.result;
}

// NXR Insight de Segurança IA (usado em Technologies.tsx)
export const generateSecurityInsight = async (topic: string): Promise<string> => {
  if (!topic.trim()) return '';
  try {
    return await callAI('insight', topic);
  } catch (err) {
    console.error('[generateSecurityInsight]', err);
    return 'Serviço de IA temporariamente indisponível. Tenta novamente.';
  }
};

// Categorização de leads (usado em Contact.tsx)
export const analyzeMessageIntent = async (message: string): Promise<string> => {
  if (!message.trim()) return 'General';
  try {
    const result = await callAI('categorize', message);
    const validCategories = ['Sales', 'Support', 'Partnership', 'General'];
    const cleaned = result.replace(/[^a-zA-Z]/g, '');
    return validCategories.includes(cleaned) ? cleaned : 'General';
  } catch {
    return 'General';
  }
};

// Chat NXR Assistant (usado no componente Chatbot)
export const sendChatMessage = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> => {
  try {
    return await callAI('chat', { message, history });
  } catch (err) {
    console.error('[sendChatMessage]', err);
    throw err; // propagar para o componente tratar
  }
};