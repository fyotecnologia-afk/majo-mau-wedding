// components/Envelope/Envelope.tsx
import React, { useState, useEffect } from "react";
import "./styles.module.scss";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

const Envelope = ({ onOpen }: { onOpen: () => void }) => {
  gsap.registerPlugin(CSSRulePlugin);

  // Control local de animación para evitar que se re-cree timeline en cada render
  let tl: GSAPTimeline | null = null;

  const openCard = () => {
    const flap = CSSRulePlugin.getRule(".envelope:before");
    tl = gsap.timeline({
      onComplete: () => {
        onOpen(); // Notifica al padre que el sobre se abrió
      },
    });

    tl.to(flap, {
      duration: 0.5,
      cssRule: {
        rotateX: 180,
      },
    })
      .set(flap, {
        cssRule: {
          zIndex: 10,
        },
      })
      .to(".envelope", {
        duration: 0.4,
        opacity: 0,
        display: "none",
        ease: "back.inOut(0.6)",
      })
      .to(".container", {
        paddingTop: "40px",
        duration: 0.4,
        ease: "back.inOut(0.6)",
      });
  };

  return (
    <div
      className="container envelope-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
    >
      <div className="content">
        <div className="envelope" onClick={openCard}></div>
        {/* Se elimina la carta y texto interno porque no quieres mostrarlo */}
      </div>
    </div>
  );
};

export default Envelope;
