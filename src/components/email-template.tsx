'use client'; // Esta linha é importante para garantir que ele seja tratado como Client Component

import * as React from 'react';

// Defina a interface para as props do seu componente
interface EmailTemplateProps {
  firstName: string;
}

// Crie e exporte seu componente funcional
export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #eee' }}>
    <h1 style={{ color: '#333' }}>Olá, {firstName}!</h1>
    <p style={{ color: '#555' }}>Bem-vindo(a) ao nosso serviço. Estamos felizes em tê-lo(a) conosco!</p>
    <p style={{ color: '#555' }}>Atenciosamente,</p>
    <p style={{ color: '#555' }}>Sua Equipe</p>
  </div>
);