// components/FuriosaPoster.tsx
"use client";

import { useRef } from "react";
import { useSpring, animated, to } from "@react-spring/web";

const IMAGE =
  "https://cdn.jsdelivr.net/gh/olivier3lanc/cinematics-resources@master/furiosa/medias/rust.jpg";

export default function FuriosaPoster() {
  const ref = useRef<HTMLDivElement>(null);
  const [style, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    api.start({ rotateX: -y * 10, rotateY: x * 10 });
  };

  const onLeave = () => api.start({ rotateX: 0, rotateY: 0 });

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: "100vmin" }}
    >
      <animated.figure
        ref={ref}
        style={{
          width: "60vmin",
          height: "80vmin",
          margin: "auto",
          transform: to(
            [style.rotateX, style.rotateY],
            (x, y) => `rotateX(${x}deg) rotateY(${y}deg)`
          ),
        }}
      >
        <span className="title" data-title="MAD MAX SAGA">
          FURIOSA
        </span>
      </animated.figure>

      <style jsx>{`
        figure {
          display: block;
        }
        .title {
          display: block;
          width: 100%;
          height: 100%;
          font-family: "Agency FB Black", sans-serif;
          font-size: 30vmin;
          line-height: 80vmin;
          text-transform: uppercase;
          position: relative;
          user-select: none;
          color: transparent;
          background-image: url("${IMAGE}");
          background-size: cover;
          background-position: center;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
        }

        .title::before {
          content: attr(data-title);
          position: absolute;
          left: 0;
          top: 0;
          color: #ffc61c5e;
          mix-blend-mode: overlay;
          text-shadow: 0px 0px 4vmin rgba(0, 0, 0, 0.4), 1px 1px #bf4528;
        }

        nav {
          position: fixed;
          bottom: 0;
          right: 0;
        }

        nav a {
          font-size: 16px;
          color: #ffc61c;
          font-family: "Agency FB Black", sans-serif;
          font-weight: 900;
          text-transform: uppercase;
          text-decoration-style: dashed;
          padding: 2em;
        }
      `}</style>

      <nav>
        <a
          href="https://codepen.io/olivier3lanc/pen/zYXxyEj"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
      </nav>
    </div>
  );
}
