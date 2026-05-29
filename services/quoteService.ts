import { createLead } from './leadService';

export const createQuote = async (quoteData: {
  serviceType: string;
  companySize: string;
  urgency: string;
  budget: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}) => {
  const message = `[ORÇAMENTO]
Serviço: ${quoteData.serviceType}
Dimensão: ${quoteData.companySize}
Urgência: ${quoteData.urgency}
Orçamento: ${quoteData.budget}
Telefone: ${quoteData.phone || 'N/A'}

${quoteData.description}`;

  return await createLead({
    name: quoteData.name,
    email: quoteData.email,
    company: quoteData.company,
    message: message,
    category: 'Quote'
  });
};
