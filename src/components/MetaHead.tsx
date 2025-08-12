import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  image?: string; // archivo dentro de /public
  url?: string;
}

export default function MetaHead({
  title = "Boda Majo & Mau",
  description = "Te invitamos a celebrar con nosotros este día tan especial.",
  image = "/preview.webp", // path relativo desde public
  url = "",
}: MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
