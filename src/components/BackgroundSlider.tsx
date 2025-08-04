"use client";

import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import styles from "../styles/BackgroundSlider.module.css";

const slides = [
  "/images/mansory/image1.jpg",
  "/images/mansory/image2.jpg",
  "/images/mansory/image1.jpg",
  "/images/mansory/image2.jpg",
];

export default function BackgroundSlider() {
  const [index, setIndex] = useState(0);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 3000 },
    onRest: (_a, _b, item) => {
      if (index === item) {
        setIndex((state) => (state + 1) % slides.length);
      }
    },
    exitBeforeEnter: true,
  });

  return (
    <div
      className="flex fill center"
      style={{ position: "relative", width: "100vw", height: "100vh" }}
    >
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
    </div>
  );
}
