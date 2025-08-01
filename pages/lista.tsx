// pages/lista.tsx
import React from 'react';
import ListaInvitaciones from '../components/ListaInvitaciones';

export default function ListaPage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Lista de URLs de Invitación</h1>
      <ListaInvitaciones />
    </div>
  );
}