"use client";

import React, { useState, useEffect, useMemo } from "react";
import useMeasure from "react-use-measure";
import { useTransition, a } from "@react-spring/web";
import shuffle from "lodash.shuffle";

import styles from "../styles/Mansory.module.css";
import data from "./data"; // tu array de items con { css: string, height: number }

function useMedia(queries: string[], values: number[], defaultValue: number) {
  // Hook para responder a media queries
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryLists = queries.map((q) => window.matchMedia(q));

    const handler = () => {
      const index = mediaQueryLists.findIndex((mql) => mql.matches);
      setValue(index === -1 ? defaultValue : values[index]);
    };

    handler();

    mediaQueryLists.forEach((mql) => mql.addEventListener("change", handler));

    return () => {
      mediaQueryLists.forEach((mql) =>
        mql.removeEventListener("change", handler)
      );
    };
  }, [queries, values, defaultValue]);

  return value;
}

function Masonry() {
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"],
    [5, 4, 3],
    2
  );
  const [ref, { width }] = useMeasure();
  const [items, setItems] = useState(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(shuffle);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [heights, gridItems] = useMemo(() => {
    const heightsArray = new Array(columns).fill(0);
    const mapped = items.map((item) => {
      const column = heightsArray.indexOf(Math.min(...heightsArray));
      const x = (width / columns) * column;
      const y = heightsArray[column];
      heightsArray[column] += item.height / 2;
      return {
        ...item,
        x,
        y,
        width: width / columns,
        height: item.height / 2,
      };
    });
    return [heightsArray, mapped];
  }, [columns, items, width]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div
      ref={ref}
      className={styles.list}
      style={{ height: Math.max(...heights) }}
    >
      {transitions((style, item) => (
        <a.div key={item.css} style={{ ...style, position: "absolute" }}>
          <div
            style={{
              backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)`,
            }}
          />
        </a.div>
      ))}
    </div>
  );
}

export default function App() {
  return <Masonry />;
}
