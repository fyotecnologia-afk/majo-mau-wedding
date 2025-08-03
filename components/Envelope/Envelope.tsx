import React, { useRef, useState } from "react";
import { gsap } from "gsap";

const Envelope = ({ onOpen }: { onOpen: () => void }) => {
  const solapaRef = useRef<HTMLImageElement>(null);
  const cartaRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);

    // Animación solapa: rotar hacia atrás con rebote
    gsap.to(solapaRef.current, {
      rotateX: -140,
      transformOrigin: "top center",
      duration: 1.2,
      ease: "power3.out",
      // Un rebote pequeño para dar naturalidad
      onComplete: () => {
        gsap.to(solapaRef.current, {
          rotateX: -150,
          duration: 0.4,
          ease: "power1.inOut",
        });
      },
    });

    // Animar carta: aparece desde abajo con rebote y opacidad
    gsap.fromTo(
      cartaRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        delay: 0.8,
        y: -140,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      }
    );

    if (onOpen) onOpen();
  };

  return (
    <div className="envelope-container" onClick={openEnvelope}>
      <div className="sobre">
        <img
          src="/images/sobre/cuerpo.png"
          alt="Cuerpo del sobre"
          className="sobre-cuerpo"
        />
        <img
          ref={solapaRef}
          src="/images/sobre/solapa.png"
          alt="Solapa del sobre"
          className="solapa"
        />
      </div>

      <div className="carta" ref={cartaRef}>
        <h2>Estás cordialmente invitado</h2>
        <p>A la celebración de nuestra unión</p>
        <button onClick={onOpen}>Entrar a la invitación</button>
      </div>

      <style jsx>{`
        .envelope-container {
          position: fixed;
          inset: 0;
          background: #f8f6f3;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
          z-index: 10000;
          font-family: "Playfair Display", serif;
          cursor: pointer;
        }

        .sobre {
          position: relative;
          width: 320px;
          transform-style: preserve-3d; /* Muy importante para 3D */
        }

        .sobre-cuerpo {
          width: 100%;
          border-radius: 8px;
          display: block;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          user-select: none;
          pointer-events: none;
        }

        .solapa {
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 50%;
          object-fit: contain;
          transform-origin: top center;
          transform-style: preserve-3d;
          backface-visibility: hidden; /* evita parpadeos */
          user-select: none;
          pointer-events: none;
        }

        .carta {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 0);
          background: #fffefc;
          border: 1px solid #d9b99b;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 360px;
          opacity: 0;
          text-align: center;
          color: #5a3e36;
          user-select: none;
          pointer-events: auto;
          cursor: default;
          /* Se controla por GSAP */
        }

        .carta h2 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: #3b2e28;
        }

        .carta p {
          font-size: 1rem;
          margin-bottom: 1.2rem;
        }

        .carta button {
          background-color: #a7896f;
          color: white;
          padding: 0.6rem 1.4rem;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .carta button:hover {
          background-color: #8f745e;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
