"use client";

import { useSpring, animated } from "@react-spring/web";

export default function Spinner() {
  const rotate = useSpring({
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    loop: true,
    config: { duration: 1000 },
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff5f8", // fondo suave tipo boda
        fontFamily: "'Georgia', serif",
      }}
    >
      <animated.div
        style={{
          ...rotate,
          width: 70,
          height: 70,
          borderRadius: "50%",
          border: "6px solid #F6F1EB", // color rosado suave
          borderTop: "6px solid #CBB278", // acento
          position: "relative",
        }}
      >
        {/* Diamante como detalle tipo anillo */}
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: "#ffffff",
            border: "2px solid #CBB278",
            borderRadius: "50%",
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />
      </animated.div>

      <p
        style={{
          marginTop: 20,
          fontSize: "1.2rem",
          color: "#CBB278",
        }}
      >
        Cargando invitación…
      </p>
    </div>
  );
}
