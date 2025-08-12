"use client";

import React, { useEffect, useState } from "react";
import weddingData from "@/data/weddingData.json";
import styles from "../styles/Welcome.module.css";

const Welcome: React.FC = () => {
  const { names, date, slides } = weddingData;

  // Fecha en formato DD.MM.YYYY
  const eventDate = new Date(date);
  const formattedDate = `${String(eventDate.getDate()).padStart(
    2,
    "0"
  )}.${String(eventDate.getMonth() + 1).padStart(
    2,
    "0"
  )}.${eventDate.getFullYear()}`;

  // Countdown
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    if (difference <= 0) return ["00", "00", "00", "00"];

    const days = String(
      Math.floor(difference / (1000 * 60 * 60 * 24))
    ).padStart(2, "0");
    const hours = String(
      Math.floor((difference / (1000 * 60 * 60)) % 24)
    ).padStart(2, "0");
    const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
      2,
      "0"
    );

    return [days, hours, minutes, seconds];
  };

  const [timeLeft, setTimeLeft] = useState<string[]>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const labels = ["Días", "Horas", "Min", "Seg"];

  return (
    <div className={styles.container}>
      {/* Nombres */}
      <div className={styles.header}>
        <h1 className={styles.names}>{names}</h1>
        <h2 className={styles.subtitle}>Wedding</h2>
      </div>

      {/* Imagen */}
      <div className={styles.imageWrapper}>
        <img src={slides[0]} alt="Wedding" className={styles.image} />
      </div>

      {/* Fecha */}
      <p className={styles.date}>{formattedDate}</p>

      {/* Contador */}
      <div className={styles.timer}>
        {timeLeft.map((num, i) => (
          <div key={i} className={styles.timeBlock}>
            <div className={styles.number}>{num}</div>
            <div className={styles.label}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
