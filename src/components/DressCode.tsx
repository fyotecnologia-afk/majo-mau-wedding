import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Paragraph } = Typography;

const DressCode: React.FC = () => {
  const { dressCode } = weddingData;

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        textAlign: "center",
        color: "#7A8B75",
        fontFamily: "'Playfair Display', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Título */}
      <div style={{ marginBottom: 32, position: "relative", zIndex: 10 }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            margin: "1rem 0 0",
          }}
          className="title-decorative"
        >
          Dress Code
        </Title>
      </div>

      {/* Imagen Dress Code */}
      <img
        src={dressCode.image}
        alt="Dress Code"
        style={{
          maxWidth: "70%",
          marginBottom: 24,
          objectFit: "cover",
          userSelect: "none",
        }}
        draggable={false}
      />

      {/* Descripción */}
      <Paragraph
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          maxWidth: 700,
          margin: "0 auto",
          color: "#7A8B75",
          userSelect: "text",
        }}
        className="font-manjari"
      >
        {dressCode.description}
      </Paragraph>
    </section>
  );
};

export default DressCode;
