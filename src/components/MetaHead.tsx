import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function MetaHead({
  title = "Boda Majo & Mau",
  description = "Te invitamos a celebrar con nosotros este día tan especial.",
  image = "/preview.webp",
  url = siteUrl,
}: MetaProps) {
  const imageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
