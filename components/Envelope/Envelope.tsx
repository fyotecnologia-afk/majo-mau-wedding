// components/EnvelopeAnimated.tsx
import React, { useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import styles from "./styles.module.css";

const EnvelopeAnimated: React.FC = () => {
  const [open, setOpen] = useState(false);

  const flap = useSpring({
    transform: open ? "rotateX(180deg)" : "rotateX(0deg)",
    config: config.stiff,
  });
  const letter = useSpring({
    transform: open ? "translateY(-80px)" : "translateY(0px)",
    config: { ...config.default, duration: 400, delay: open ? 200 : 0 },
  });
  const hearts = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? "translateY(-200px)" : "translateY(0px)",
    config: { duration: 2000 },
    delay: open ? 400 : 0,
  });

  return (
    <div
      className={styles.wrapper}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.envelope}>
        <animated.div className={styles.flap} style={flap} />
        <div className={styles.pocket} />
        <animated.div className={styles.letter} style={letter}>
          <p className={styles.text}>¡Hola!</p>
        </animated.div>
        <animated.div className={styles.hearts} style={hearts}>
          <div className={`${styles.heart} ${styles.a1}`} />
          <div className={`${styles.heart} ${styles.a2}`} />
          <div className={`${styles.heart} ${styles.a3}`} />
        </animated.div>
      </div>
    </div>
  );
};

export default EnvelopeAnimated;
