"use client";

import React, { useRef } from "react";
import { useSprings, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash/clamp";
import styles from "../styles/Viewpages.module.css";

const pages: string[] = [
  "images/mansory/image1.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "images/mansory/image2.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "images/mansory/image1.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "images/mansory/image2.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "images/mansory/image1.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
];

function Viewpager() {
  const index = useRef(0);
  const [ref, { width }] = useMeasure();

  const [springs, api] = useSprings(
    pages.length,
    (i) => ({
      x: i * width,
      scale: width === 0 ? 0 : 1,
      display: "block",
    }),
    [width]
  );

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], distance: [dx], cancel }) => {
      if (active && dx > width / 2) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        );
        cancel?.();
      }

      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" };
        const x = (i - index.current) * width + (active ? mx : 0);
        const scale = active ? 1 - dx / width / 2 : 1;
        return { x, scale, display: "block" };
      });
    },
    { axis: "x" } // solo arrastre horizontal
  );

  return (
    <div ref={ref} className={styles.wrapper}>
      {springs.map(({ x, display, scale }, i) => (
        <animated.div
          key={i}
          className={styles.page}
          {...bind()}
          style={{ display, x }}
        >
          <animated.div
            className={styles.background}
            style={{
              scale,
              backgroundImage: `url(${pages[i]})`,
            }}
          />
        </animated.div>
      ))}
    </div>
  );
}

export default Viewpager;
