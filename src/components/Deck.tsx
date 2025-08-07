"use client";

import React, { useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styles from "../styles/Deck.module.css";

const cards = [
  { type: "image", content: "/images/mansory/gallery-9.webp" },
  { type: "text", content: "FRASE 3" },
  { type: "image", content: "/images/mansory/gallery-10.webp" },
  { type: "text", content: "FRASE 2" },
  { type: "image", content: "/images/mansory/gallery-11.webp" },
  { type: "text", content: "FRASE 1" },
  { type: "image", content: "/images/mansory/gallery-12.webp" },
  { type: "text", content: "Nuestros momentos son mágicos" },
];

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set<number>());
  const [springs, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(),
  }));

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity[0] > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) gone.add(index);

      api.start((i) => {
        if (i !== index) return;
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100 + (isGone ? dir * 10 * velocity[0] : 0);
        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });

      if (!down && gone.size === cards.length) {
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
      }
    },
    { filterTaps: true }
  );

  return (
    <>
      {springs.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} className={styles.deck} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage:
                cards[i].type === "image"
                  ? `url(${cards[i].content})`
                  : undefined,
              touchAction: "none",
              userSelect: "none",
              cursor: "grab",
              // Solo para texto, centra el contenido
              display: cards[i].type === "text" ? "flex" : undefined,
              alignItems: cards[i].type === "text" ? "center" : undefined,
              justifyContent: cards[i].type === "text" ? "center" : undefined,
              textAlign: cards[i].type === "text" ? "center" : undefined,
              color: cards[i].type === "text" ? "black" : undefined,
              fontSize: cards[i].type === "text" ? "2.5rem" : undefined,
              fontWeight: cards[i].type === "text" ? "bold" : undefined,
              padding: cards[i].type === "text" ? "2rem" : undefined,
            }}
          >
            {cards[i].type === "text" ? cards[i].content : null}
          </animated.div>
        </animated.div>
      ))}
    </>
  );
}

export default function DeckPage() {
  return (
    <div className={styles.container}>
      <Deck />
    </div>
  );
}
