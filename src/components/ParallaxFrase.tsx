"use client";

import React from "react";
import { useSpring, animated } from "@react-spring/web";

const ParallaxQuote: React.FC = () => {
  const [props, set] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 120, friction: 20 },
  }));

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      set({ y: scrollY * 0.3 }); // Parallax factor
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [set]);

  return (
    <div
      style={{
        position: "relative",
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(180deg, #fffef8 0%, #f6f1eb 100%)",
        padding: "2rem",
      }}
    >
      <animated.h2
        style={{
          transform: props.y.to((y) => `translateY(${y}px)`),
          fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
          textAlign: "center",
          maxWidth: "900px",
          color: "#7A8B75",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
          lineHeight: 1.4,
          margin: 0,
          padding: "0 1rem",
        }}
      >
        NOS ELEGIMOS UNA VEZ…
        <br />
        Y HOY CON MÁS AMOR,
        <br />
        NOS ELEGIMOS PARA SIEMPRE
      </animated.h2>
    </div>
  );
};

export default ParallaxQuote;
