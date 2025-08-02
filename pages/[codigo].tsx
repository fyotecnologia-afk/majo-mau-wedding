import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AnimatedBars from '../components/AnimatedBars/AnimatedBars';
import Formulario from '../components/FormularioConfirmacion';
import DeckComponent from '../components/Deck/Deck';
import NoiseAnimation from '../components/NoiseAnimation/NoiseAnimation';
import TrailAnimation from '../components/TrailAnimation/TrailAnimation';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import BackgroundSlider from '../components/BackgroundSlider/BackgroundSlider';
import Masonry from '../components/Masonry/Masonry';
import Viewpages from '../components/Viewpager/Viewpages';

// ✅ Define el tipo de datos esperados
type DataResponse = {
  exists: boolean;
  estado?: string;
  confirmaciones?: number;
};

export default function ConfirmacionPage() {
  const router = useRouter();
  const { codigo } = router.query;
  const [numero, setNumero] = useState<string | null>(null);
  const [data, setData] = useState<DataResponse | null>(null); // ✅ Usa el tipo aquí

  useEffect(() => {
    if (!codigo) return;
    const decoded = atob(codigo as string);
    setNumero(decoded);

    fetch(`/api/invitaciones/${encodeURIComponent(decoded)}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({ exists: false })); // ✅ Ya no lanza error
  }, [codigo]);

  if (!data) return <p>Cargando...</p>;
  if (!data.exists || data.estado !== 'ACTIVO') return <p>No válido.</p>;

  return (
    <>
      {/* <AnimatedBars /> */}
      <Masonry />
      <ImageSlider />
      <TrailAnimation />
      <NoiseAnimation />
      <BackgroundSlider />
      <DeckComponent />
      <Viewpages />
      {data.confirmaciones! < 2 && <Formulario numero={numero} />}
    </>
  );
}
