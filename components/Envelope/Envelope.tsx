import React from "react";
import styles from "./styles.module.scss";

const FuriosaPoster: React.FC = () => {
  return (
    <>
      <main className={styles.main}>
        <article className={styles.furiosaPoster}>
          <header className={styles.furiosaPosterHeader}>
            <h1 className={styles.furiosaPosterTitle} data-title="FURIOSA">
              FURIOSA
            </h1>
          </header>
          <p className={styles.anya}>Anya Taylor-Joy</p>
          <p className={styles.chris}>Chris Hemsworth</p>
          <p className={styles.george}>
            From mastermind <strong>George Miller</strong>
          </p>
          <p className={styles.madMaxSaga}>
            <span data-title="A Mad">A Mad</span>
            <span data-title="Max Saga">Max Saga</span>
          </p>
          <img
            className={styles.frontImage}
            src="https://cdn.jsdelivr.net/gh/olivier3lanc/cinematics-resources@master/furiosa/medias/furiosa_front.webp"
            alt="Furiosa Front image"
          />
        </article>
      </main>
      <nav className={styles.nav}>
        <a
          href="https://www.furiosaamadmaxsaga.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official page
        </a>
      </nav>
    </>
  );
};

export default FuriosaPoster;
