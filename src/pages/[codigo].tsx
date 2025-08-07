// pages/[codigo].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Componentes
import Welcome from "../components/Welcome";
import TrailAnimation from "../components/TrailAnimation";
import Masonry from "../components/Masonry";
import BackgroundSlider from "../components/BackgroundSlider";
import DeckComponent from "../components/Deck";
import Viewpages from "../components/Viewpages";
import Formulario from "../components/FormularioConfirmacion";
import WeddingEvents from "../components/WeddingEvents";
import HotelSuggestions from "../components/HotelSuggestions";
import Spinner from "../components/Spinner";
import FamilySection from "../components/FamilySection";
import MusicPlayer from "../components/MusicPlayer";
import Makeup from "../components/Makeup";
import RentCars from "../components/RentCars";

// Tipado
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

  useEffect(() => {
    if (!codigo) return;

    const decoded = atob(codigo as string);
    setNumero(decoded);

    fetch(`/api/invitaciones/${encodeURIComponent(decoded)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ exists: false }));
  }, [codigo]);

  if (!data) return <Spinner />;
  if (!data.exists || data.estado !== "ACTIVO")
    return <p>Invitación no válida.</p>;

  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Welcome />
      </div>

      <MusicPlayer src="/music/cancion.mp3" />

      <div style={{ position: "relative", height: "100vh" }}>
        <TrailAnimation />
      </div>

      <div style={{ position: "relative" }}>
        <Masonry />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <WeddingEvents />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <BackgroundSlider />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <FamilySection />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <DeckComponent />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <HotelSuggestions />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Makeup />
      </div>

      <div style={{ position: "relative" }}>
        <RentCars />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Viewpages />
      </div>

      {data.confirmaciones! < 2 && (
        <div style={{ position: "relative", zIndex: 2, marginTop: "2rem" }}>
          <Formulario numero={numero} />
        </div>
      )}
    </main>
  );
}
