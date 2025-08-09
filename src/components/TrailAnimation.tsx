"use client";

import React, { useEffect } from "react";
import { useSpring, a } from "@react-spring/web";
import weddingData from "@/data/weddingData.json";
import styles from "../styles/TrailAnimation.module.css"; // puedes renombrar si quieres

export default function ParallaxQuote() {
  const frase = weddingData?.parallaxQuote ?? "NOS ELEGIMOS PARA SIEMPRE";

  // Efecto parallax en el fondo (no en el texto)
  const [bgProps, api] = useSpring(() => ({
    y: 0,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      api.start({ y: scrollY * 0.2 }); // parallax sutil
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);

  return (
    <a.div
      className={styles.container}
      style={{
        backgroundPositionY: bgProps.y.to((y) => `${-y}px`),
      }}
    >
      <div className={styles.quoteWrapper}>
        <span className={styles.quoteText}>{frase}</span>
      </div>
    </a.div>
  );
}
