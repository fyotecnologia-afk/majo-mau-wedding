import React, { useRef, useState } from "react";
import { gsap } from "gsap";

type EnvelopeProps = {
  onAnimationComplete: () => void;
};

const Envelope = ({ onAnimationComplete }: EnvelopeProps) => {
  const solapaRef = useRef<HTMLImageElement>(null);
  const [isOpening, setIsOpening] = useState(false);

  const openEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    gsap.to(solapaRef.current, {
      rotateX: -150,
      duration: 1.2,
      ease: "back.out(1.7)",
      transformOrigin: "top center",
      onComplete: () => {
        // Aquí avisamos que terminó la animación para que muestres el contenido
        onAnimationComplete();
      },
    });
  };

  return (
    <div className="envelope-container" onClick={openEnvelope}>
      <div className="sobre">
        <img
          src="/images/sobre/cuerpo.png"
          alt="Cuerpo del sobre"
          className="sobre-cuerpo"
          draggable={false}
        />
        <img
          ref={solapaRef}
          src="/images/sobre/solapa.png"
          alt="Solapa del sobre"
          className="solapa"
          draggable={false}
          style={{ transform: "rotateX(0deg)" }}
        />
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
          user-select: none;
        }

        .sobre {
          position: relative;
          width: 320px;
          transform-style: preserve-3d;
          user-select: none;
        }

        .sobre-cuerpo {
          width: 100%;
          border-radius: 8px;
          display: block;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          pointer-events: none;
          user-select: none;
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
          backface-visibility: hidden;
          pointer-events: none;
          user-select: none;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
