import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Envelope from "../components/Envelope/Envelope"; // importa el sobre
import AnimatedBars from "../components/AnimatedBars/AnimatedBars";
import Formulario from "../components/FormularioConfirmacion";
import DeckComponent from "../components/Deck/Deck";
import NoiseAnimation from "../components/NoiseAnimation/NoiseAnimation";
import TrailAnimation from "../components/TrailAnimation/TrailAnimation";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import BackgroundSlider from "../components/BackgroundSlider/BackgroundSlider";
import Masonry from "../components/Masonry/Masonry";
import Viewpages from "../components/Viewpager/Viewpages";

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
  const [open, setOpen] = useState(false); // controla si el sobre está abierto

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

  // Si no está abierto, muestra solo el sobre con un mensaje para abrirlo
  if (!open) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Envelope>
          {/* Aquí puedes poner un mensaje dentro del sobre, o una imagen, etc */}
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <h2>¡Tienes una invitación!</h2>
            <p>Haz click para abrir</p>
          </div>
        </Envelope>
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#c1440e",
            color: "white",
            border: "none",
            borderRadius: 6,
            userSelect: "none",
          }}
          aria-label="Abrir invitación"
        >
          Abrir invitación
        </button>
      </div>
    );
  }

  // Si está abierto, muestra todo el contenido de la invitación
  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", height: "100vh" }}>
        <Masonry />
      </div>
      <div style={{ position: "relative", height: "100vh" }}>
        <AnimatedBars />
      </div>
      <div style={{ position: "relative", height: "100vh" }}>
        <ImageSlider />
      </div>
      <div style={{ position: "relative", height: "100vh" }}>
        <TrailAnimation />
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
    </main>
  );
}
