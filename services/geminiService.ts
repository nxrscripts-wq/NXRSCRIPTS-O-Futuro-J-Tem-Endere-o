import { supabase } from '../lib/supabase';

export const generateSecurityInsight = async (topic: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-analyze', {
      body: { type: 'insight', payload: topic }
    });

    if (error) {
      console.error("Error calling ai-analyze function:", error);
      return "Erro ao consultar a IA. A função pode estar indisponível.";
    }

    return data?.result || "Insight de segurança indisponível no momento.";
  } catch (error) {
    console.error("Exception calling ai-analyze function:", error);
    return "Erro ao consultar a IA. Verifique a sua conexão.";
  }
};

export const analyzeMessageIntent = async (message: string): Promise<string> => {
    try {
        const { data, error } = await supabase.functions.invoke('ai-analyze', {
            body: { type: 'categorize', payload: message }
        });

        if (error) {
            console.error("Error calling ai-analyze function:", error);
            return "General";
        }

        return data?.result || "General";
    } catch (error) {
        console.error("Exception calling ai-analyze function:", error);
        return "General";
    }
}