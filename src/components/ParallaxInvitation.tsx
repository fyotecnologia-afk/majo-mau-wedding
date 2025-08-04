// components/ParallaxInvitation.tsx
import React, { useRef } from "react";
import { Parallax, ParallaxLayer, IParallax } from "@react-spring/parallax";

const ParallaxInvitation = () => {
  const parallax = useRef<IParallax>(null);

  const scrollToPage = (page: number) => {
    parallax.current?.scrollTo(page);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Parallax ref={parallax} pages={3}>
        {/* Background layer */}
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={3}
          style={{
            backgroundImage: "url(/your-background.jpg)", // <-- cambia esta imagen
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Página 1: Portada */}
        <ParallaxLayer
          offset={0}
          speed={0.3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
            textAlign: "center",
          }}
          onClick={() => scrollToPage(1)}
        >
          <h1 className="names">Janet & Diego</h1>
          <p className="date">03 de octubre de 2025</p>
          <p>(haz clic para continuar)</p>
        </ParallaxLayer>

        {/* Página 2: Cuenta regresiva o contenido */}
        <ParallaxLayer
          offset={1}
          speed={0.3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
          onClick={() => scrollToPage(2)}
        >
          <h2>¡Falta poco!</h2>
          <div className="timer">
            <div className="timeBlock">
              <span className="number">60</span>
              <span className="label">Días</span>
            </div>
            <div className="timeBlock">
              <span className="number">12</span>
              <span className="label">Horas</span>
            </div>
            <div className="timeBlock">
              <span className="number">30</span>
              <span className="label">Minutos</span>
            </div>
            <div className="timeBlock">
              <span className="number">45</span>
              <span className="label">Segundos</span>
            </div>
          </div>
        </ParallaxLayer>

        {/* Página 3: Confirmación o mensaje final */}
        <ParallaxLayer
          offset={2}
          speed={0.3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            backgroundColor: "#00000080",
            textAlign: "center",
          }}
          onClick={() => scrollToPage(0)}
        >
          <h2>¡Te esperamos!</h2>
          <p>Haz clic para volver arriba</p>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default ParallaxInvitation;
