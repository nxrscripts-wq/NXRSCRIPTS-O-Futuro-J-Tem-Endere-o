import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi } from 'vitest';
import Contact from '../../pages/Contact';

vi.mock('../../services/leadService', () => ({
  createLead: vi.fn().mockResolvedValue(null)
}));

// Wrapper com providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </HelmetProvider>
);

describe('Contact page', () => {
  it('renderiza todos os campos do formulário', () => {
    render(<Contact />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
  });

  it('botão de submit está presente e activo inicialmente', () => {
    render(<Contact />, { wrapper: Wrapper });
    const submitBtn = screen.getByRole('button', { name: /iniciar contacto/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('não submete quando campos obrigatórios estão vazios', async () => {
    const user = userEvent.setup();
    render(<Contact />, { wrapper: Wrapper });
    const submitBtn = screen.getByRole('button', { name: /iniciar contacto/i });
    await user.click(submitBtn);
    
    // Verificar que a mensagem de sucesso não aparece
    expect(screen.queryByText(/Transmissão Recebida/i)).not.toBeInTheDocument();
  });

  it('formulário com honeypot preenchido não submete', async () => {
    const { createLead } = await import('../../services/leadService');
    const createLeadMock = vi.mocked(createLead);
    createLeadMock.mockClear();

    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<Contact />, { wrapper: Wrapper });
    
    // Preencher honeypot (simulando bot)
    const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
    if (honeypot) {
      fireEvent.change(honeypot, { target: { value: 'bot-filled' } });
    }
    
    // Preencher campos legítimos
    await userEvent.setup().type(screen.getByLabelText(/nome completo/i), 'João');
    await userEvent.setup().type(screen.getByLabelText(/email/i), 'joao@test.ao');
    await userEvent.setup().type(screen.getByLabelText(/mensagem/i), 'Olá mundo');
    
    await userEvent.setup().click(screen.getByRole('button', { name: /iniciar contacto/i }));
    
    expect(createLeadMock).not.toHaveBeenCalled();
  });
});
