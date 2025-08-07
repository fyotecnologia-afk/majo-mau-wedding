// src/components/Welcome.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTrail, useTransition, a, animated } from "@react-spring/web";
import styles from "../styles/Welcome.module.css";
import weddingData from "@/data/weddingData.json";

const CountdownSection = () => {
  const { names, date, slides } = weddingData;

  // Fondo con transición animada
  const [index, setIndex] = useState(0);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 2000 },
    onRest: (_a, _b, item) => {
      if (index === item) {
        setIndex((state) => (state + 1) % slides.length);
      }
    },
    exitBeforeEnter: true,
  });

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

  const trail = useTrail(timeLeft.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    x: 0,
    height: 110,
    from: { opacity: 0, x: 20, height: 0 },
  });

  const labels = ["Días", "Horas", "Min", "Seg"];

  return (
    <div className={styles.fullscreenContainer}>
      {/* Fondo con transición */}
      {transitions((style, i) => (
        <animated.div
          key={i}
          className={styles.bg}
          style={{
            ...style,
            backgroundImage: `url(${slides[i]})`,
          }}
        />
      ))}

      {/* Contenido sobrepuesto */}
      <div className={styles.overlay}>
        <h1 className={styles.names}>
          {names} <br />
          Wedding
        </h1>
        <h2 className={styles.date}>
          {new Date(date).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>

        <div className={styles.timer}>
          {trail.map(({ height, ...style }, index) => (
            <a.div key={index} className={styles.trailsText} style={style}>
              <a.div style={{ height }}>
                <div className={styles.timeBlock}>
                  <div className={styles.number}>{timeLeft[index]}</div>
                  <div className={styles.label}>{labels[index]}</div>
                </div>
              </a.div>
            </a.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownSection;
