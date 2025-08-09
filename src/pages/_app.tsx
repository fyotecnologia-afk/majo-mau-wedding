// pages/_app.tsx
import type { AppProps } from "next/app";
import MetaHead from "@/components/MetaHead"; // importa tu componente

import {
  Meow_Script,
  Roboto,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";

import "../styles/globals.css";

// Fuentes
const meow = Meow_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-meow",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${roboto.variable} ${meow.variable} ${greatVibes.variable} ${playfair.variable}`}
    >
      {/* Meta global, puede ser sobreescrito en las páginas */}
      <MetaHead />
      <Component {...pageProps} />
    </main>
  );
}
