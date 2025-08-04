// pages/[codigo].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AnimatedBars from "../components/AnimatedBars";
import Formulario from "../components/FormularioConfirmacion";
import DeckComponent from "../components/Deck";
import TrailAnimation from "../components/TrailAnimation";
import ImageSlider from "../components/ImageSlider";
import BackgroundSlider from "../components/BackgroundSlider";
import Masonry from "../components/Masonry";
import Viewpages from "../components/Viewpages";
import Envelope from "../components/Envelope";
import Welcome from "../components/Welcome";
import ParallaxInvitation from "../components/ParallaxInvitation"; // <-- nuevo componente

type DataResponse = {
  exists: boolean;
  estado?: string;
  confirmaciones?: number;
};

export default function ConfirmacionPage() {
  const router = useRouter();
  const { codigo } = router.query;
  const [numero, setNumero] = useState<string | null>(null);
  const [data, setData] = useState<DataResponse | null>(null);

  // Estado para controlar si el sobre ya fue abierto (animación completada)
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    if (!codigo) return;
    const decoded = atob(codigo as string);
    setNumero(decoded);

    fetch(`/api/invitaciones/${encodeURIComponent(decoded)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ exists: false }));
  }, [codigo]);

  if (!data) return <p>Cargando...</p>;
  if (!data.exists || data.estado !== "ACTIVO") return <p>No válido.</p>;

  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      {/* Mostrar el sobre solo si NO se ha abierto */}
      {!envelopeOpened && (
        <Envelope
          onAnimationComplete={() => {
            setEnvelopeOpened(true);
          }}
        />
      )}

      {/* Mostrar los demás componentes SOLO si el sobre fue abierto */}
      {envelopeOpened && (
        <>
          <div style={{ position: "relative", height: "100vh" }}>
            <Welcome />
          </div>
          <div style={{ position: "relative", height: "100vh" }}>
            <TrailAnimation />
          </div>

          <div style={{ position: "relative", height: "100vh" }}>
            <Masonry />
          </div>

          <div style={{ position: "relative", height: "100vh" }}>
            <BackgroundSlider />
          </div>

          <div style={{ position: "relative", height: "100vh" }}>
            <DeckComponent />
          </div>

          <div style={{ position: "relative", height: "100vh" }}>
            <Viewpages />
          </div>

          {data.confirmaciones! < 2 && (
            <div style={{ position: "relative", zIndex: 2, marginTop: "2rem" }}>
              <Formulario numero={numero} />
            </div>
          )}
        </>
      )}
    </main>
  );
}
