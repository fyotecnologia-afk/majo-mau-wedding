"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import styles from "../styles/Mansory.module.css";

export default function MansoryGallery() {
  const [open, setOpen] = useState(false);

  const slides = [
    {
      src: "/images/mansory/gallery-15.webp",
    },
    {
      src: "/images/mansory/gallery-14.webp",
    },
    {
      src: "/images/mansory/gallery-13.webp",
    },
    {
      src: "/images/mansory/gallery-12.webp",
    },
    {
      src: "/images/mansory/gallery-11.webp",
    },
    {
      src: "/images/mansory/gallery-10.webp",
    },
    {
      src: "/images/mansory/gallery-9.webp",
    },
    {
      src: "/images/mansory/gallery-8.webp",
    },
    {
      src: "/images/mansory/gallery-7.webp",
    },
    {
      src: "/images/mansory/gallery-6.webp",
    },
    {
      src: "/images/mansory/gallery-5.webp",
    },
    {
      src: "/images/mansory/gallery-4.webp",
    },
    {
      src: "/images/mansory/gallery-3.webp",
    },
    {
      src: "/images/mansory/gallery-2.webp",
    },
    {
      src: "/images/mansory/gallery-1.webp",
    },
  ];

  return (
    <div className={styles.galleryContainer}>
      {/* Solo mostramos la primera imagen */}
      <img
        src={slides[0].src}
        alt="foto principal"
        className={styles.previewImage}
        onClick={() => setOpen(true)}
      />

      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </div>
  );
}
