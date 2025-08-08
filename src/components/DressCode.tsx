import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Paragraph } = Typography;

const DressCode: React.FC = () => {
  const { dressCode } = weddingData; // Asumiendo que tienes algo así en tu JSON

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "3rem auto",
        padding: 24,
        borderRadius: 24,
        border: `1px solid #CBB278`,
        boxShadow:
          "0 12px 24px rgba(122, 139, 117, 0.15), 0 8px 16px rgba(203, 178, 120, 0.3)",
        background: "linear-gradient(180deg, #F6F1EB 0%, #fffef8 100%)",
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
            color: "#7A8B75",
            fontWeight: "bold",
            fontSize: "2.8rem",
            letterSpacing: "0.05em",
            marginBottom: 6,
            fontFamily: "'Playfair Display', serif",
          }}
          className="title-decorative"
        >
          Dress Code
        </Title>
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: "#CBB278",
            borderRadius: 100,
            margin: "0 auto",
          }}
        />
      </div>

      {/* Imagen Dress Code */}
      <img
        src={dressCode.image}
        alt="Dress Code"
        style={{
          maxWidth: "100%",
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(203, 178, 120, 0.3)",
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
          fontStyle: "italic",
          color: "#7A8B75",
          userSelect: "text",
        }}
      >
        {dressCode.description}
      </Paragraph>
    </section>
  );
};

export default DressCode;
