// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";

// Importa las fuentes con next/font
import { Great_Vibes, Playfair_Display } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${greatVibes.variable} ${playfair.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
