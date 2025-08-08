import React, { useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { FaGift, FaCreditCard, FaUniversity } from "react-icons/fa";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

const GiftTable: React.FC = () => {
  const { message, options } = weddingData.giftTable;
  const [copiedText, setCopiedText] = useState<string>("");

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000); // limpia mensaje después de 2s
    } catch {
      alert("No se pudo copiar al portapapeles");
    }
  };

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "3rem auto",
        padding: 24,
        borderRadius: 24,
        border: `1px solid #F6F1EB`,
        boxShadow:
          "0 12px 24px rgba(122, 139, 117, 0.15), 0 8px 16px rgba(122, 139, 117, 0.1)",
        background: "linear-gradient(180deg, #F6F1EB 0%, #fffef8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Título */}
      <div
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            margin: "1rem 0 0",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
          className="title-decorative"
        >
          Mesa de Regalos
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

      {/* Mensaje */}
      <Text
        style={{
          display: "block",
          textAlign: "center",
          color: "#7A8B75",
          fontSize: 16,
          fontStyle: "italic",
          maxWidth: 600,
          margin: "0 auto 40px auto",
          lineHeight: 1.5,
          userSelect: "none",
        }}
      >
        {message}
      </Text>

      {/* Opciones */}
      <Row gutter={[24, 24]} justify="center">
        {options.map((option, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: 20,
                boxShadow: "0 10px 25px rgba(122, 139, 117, 0.12)",
                border: `1px solid #F6F1EB`,
                background: "rgba(246, 241, 235, 0.9)",
                transition: "all 0.3s ease",
                color: "#7A8B75",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = "0 15px 40px rgba(203, 178, 120, 0.3)";
                el.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = "0 10px 25px rgba(122, 139, 117, 0.12)";
                el.style.transform = "translateY(0)";
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {option.type === "Liverpool" ? (
                    <img
                      src="/icons/liverpool-logo.webp"
                      alt="Liverpool"
                      style={{ width: 28, height: 28, objectFit: "contain" }}
                    />
                  ) : option.type === "Transferencia" ? (
                    <FaUniversity style={{ fontSize: 28, color: "#CBB278" }} />
                  ) : null}
                  <span
                    style={{
                      color: "#7A8B75",
                      fontWeight: "600",
                      fontSize: 18,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {option.type}
                  </span>
                </div>
              }
            >
              {/* Detalles */}
              <div style={{ padding: "0 0" }}>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    color: "#7A8B75",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {Object.entries(option.details).map(([key, value]) => (
                    <li
                      key={key}
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "600",
                        marginBottom: 6,
                        cursor:
                          key.toLowerCase().includes("numeroevento") ||
                          key.toLowerCase().includes("beneficiario") ||
                          key.toLowerCase().includes("tarjeta") ||
                          key.toLowerCase().includes("cuenta") ||
                          key.toLowerCase().includes("clabe")
                            ? "pointer"
                            : "default",
                        userSelect:
                          key.toLowerCase().includes("numeroevento") ||
                          key.toLowerCase().includes("beneficiario") ||
                          key.toLowerCase().includes("tarjeta") ||
                          key.toLowerCase().includes("cuenta") ||
                          key.toLowerCase().includes("tarjeta") ||
                          key.toLowerCase().includes("clabe")
                            ? "all"
                            : "none",
                      }}
                      onClick={() => {
                        if (
                          key.toLowerCase().includes("numeroevento") ||
                          key.toLowerCase().includes("beneficiario") ||
                          key.toLowerCase().includes("tarjeta") ||
                          key.toLowerCase().includes("cuenta") ||
                          key.toLowerCase().includes("tarjeta") ||
                          key.toLowerCase().includes("clabe")
                        ) {
                          handleCopy(value);
                        }
                      }}
                      title={
                        key.toLowerCase().includes("numeroevento") ||
                        key.toLowerCase().includes("beneficiario") ||
                        key.toLowerCase().includes("tarjeta") ||
                        key.toLowerCase().includes("cuenta") ||
                        key.toLowerCase().includes("tarjeta") ||
                        key.toLowerCase().includes("clabe")
                          ? "Click para copiar"
                          : undefined
                      }
                    >
                      {key.replace(/([A-Z])/g, " $1")}:&nbsp;
                      <strong style={{ color: "#CBB278" }}>{value}</strong>
                      {copiedText === value && (
                        <span
                          style={{
                            marginLeft: 8,
                            color: "#7A8B75",
                            fontSize: 12,
                          }}
                        >
                          Copiado!
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default GiftTable;
