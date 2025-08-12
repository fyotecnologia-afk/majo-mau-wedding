"use client";

import React from "react";
import weddingData from "@/data/weddingData.json";
import styles from "../styles/TrailAnimation.module.css";

export default function ParallaxQuote() {
  const frase = weddingData?.parallaxQuote ?? "NOS ELEGIMOS PARA SIEMPRE";

  return (
    <div className={styles.container}>
      <div className={styles.quoteWrapper}>
        <span className={styles.quoteText}>{frase}</span>
      </div>
    </div>
  );
}
