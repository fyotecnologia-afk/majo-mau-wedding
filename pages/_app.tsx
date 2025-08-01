// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@/styles/globals.css'; // 👈 Aquí va tu import global

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
