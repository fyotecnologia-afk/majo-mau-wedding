import dynamic from 'next/dynamic';

// Esto evita que Next.js lo intente renderizar en el servidor
const ListaInvitaciones = dynamic(() => import('../components/ListaInvitaciones'), { ssr: false });

export default function ListaPage() {
  return <ListaInvitaciones />;
}
