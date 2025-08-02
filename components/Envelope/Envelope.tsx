// components/Envelope.tsx
import React, { ReactNode, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

interface EnvelopeProps {
  children: ReactNode;
}

const Envelope: React.FC<EnvelopeProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const flapStyles = useSpring({
    transform: isOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
    config: { mass: 1, tension: 280, friction: 30 },
  });

  const contentStyles = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(20%)",
    config: { tension: 220, friction: 20 },
  });

  return (
    <div
      style={{
        perspective: 600,
        width: 300,
        margin: "40px auto",
        cursor: "pointer",
      }}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setIsOpen(!isOpen);
        }
      }}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Cerrar invitación" : "Abrir invitación"}
    >
      <div
        style={{
          position: "relative",
          width: 300,
          height: 200,
          backgroundColor: "#c1440e",
          borderRadius: 12,
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          userSelect: "none",
        }}
      >
        {/* Ala (tapa) que rota */}
        <animated.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "50%",
            backgroundColor: "#9c2e04",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            transformOrigin: "bottom center",
            ...flapStyles,
            boxShadow: "inset 0 5px 10px rgba(0,0,0,0.2)",
            zIndex: 2,
          }}
        />

        {/* Parte inferior del sobre */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "50%",
            backgroundColor: "#d35400",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        />

        {/* Contenido de la invitación */}
        <animated.div
          style={{
            position: "absolute",
            top: "55%",
            left: 0,
            width: "100%",
            height: "45%",
            padding: 15,
            backgroundColor: "white",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            ...contentStyles,
            pointerEvents: isOpen ? "auto" : "none",
            color: "#333",
          }}
        >
          {children}
        </animated.div>
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 12,
          userSelect: "none",
          fontWeight: "bold",
          color: "#c1440e",
        }}
      >
        {isOpen ? "Cerrar invitación" : "Abrir invitación"}
      </p>
    </div>
  );
};

export default Envelope;
