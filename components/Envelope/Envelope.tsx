import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface Props {
  onFinish: () => void;
}

const FuriosaIntro: React.FC<Props> = ({ onFinish }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHide(true);
      setTimeout(onFinish, 1000); // tiempo para la animación de salida
    }, 5000); // mostrar 5s

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className={`${styles.introWrapper} ${hide ? styles.hide : ""}`}>
      <div className={styles.poster}>
        <h1 data-title="FURIOSA">FURIOSA</h1>
        <p className={styles.subtitle}>Anya Taylor-Joy & Chris Hemsworth</p>
        <img
          src="https://cdn.jsdelivr.net/gh/olivier3lanc/cinematics-resources@master/furiosa/medias/furiosa_front.webp"
          alt="Furiosa"
        />
        <p className={styles.saga}>A Mad Max Saga</p>
      </div>
    </div>
  );
};

export default FuriosaIntro;
