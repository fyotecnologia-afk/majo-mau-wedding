// components/Envelope/Envelope.tsx
import React, { useEffect } from "react";
import "./styles.module.scss";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

const Envelope = () => {
  gsap.registerPlugin(CSSRulePlugin);

  const openCard = () => {
    const flap = CSSRulePlugin.getRule(".envelope:before");
    const tl = gsap.timeline();

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
      .to(".letter", {
        translateY: -180,
        duration: 0.7,
        ease: "back.inOut(1.0)",
      })
      .set(".letter", {
        zIndex: 40,
        ease: "back.inOut(0.8)",
      })
      .to(".envelope", {
        duration: 0.4,
        opacity: 0,
        display: "none",
        ease: "back.inOut(0.6)",
      })
      .to(".letter", {
        duration: 0.4,
        ease: "back.out(1.0)",
        translateY: -5,
        width: "90vw",
        height: "unset",
        overflow: "unset",
        position: "relative",
      })
      .to(".container", {
        paddingTop: "40px",
        duration: 0.4,
        ease: "back.inOut(0.6)",
      })
      .to(".body", {
        opacity: 1,
        duration: 0.3,
        ease: "back.inOut(0.4)",
      });
  };

  const closeCard = () => {
    gsap.to(".container", { paddingTop: "0px" });
    gsap.to(".body", { opacity: 0 });
    gsap.to(".letter", {
      translateY: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(".letter", { zIndex: 0 });
        gsap.set(".envelope", { display: "block", opacity: 1 });
        gsap.set(CSSRulePlugin.getRule(".envelope:before"), {
          rotateX: 0,
        });
      },
    });
  };

  return (
    <div className="container" style={{ position: "relative", zIndex: 9999 }}>
      <div className="content">
        <div className="envelope" onClick={openCard}></div>
        <div className="letter">
          <div className="body">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2>Este es el título de la carta</h2>
              <p>
                Aquí va el contenido de la invitación o el mensaje especial.
              </p>
              <p>
                Puedes poner información más extensa aquí si es necesario,
                incluyendo enlaces, datos de contacto o cualquier otro detalle.
              </p>
              <button onClick={closeCard} style={{ marginTop: "1rem" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;
