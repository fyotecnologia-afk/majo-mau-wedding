import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";
import LocationPinIcon from "./LocationPin";

const { Title, Text } = Typography;

interface Hotel {
  name: string;
  address: string;
  phone?: string;
  mapsLink: string;
  image: string;
}

const mapsButtonStyle: React.CSSProperties = {
  backgroundColor: "#d6b77b", // dorado
  color: "#fff",
  border: "none",
  borderRadius: "25px 6px 6px 25px", // izquierda redondeada, derecha ligera
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0 20px 0 0", // más espacio a la derecha que a la izquierda
  textTransform: "uppercase",
  fontSize: "10px",
  gap: "8px",
  height: "40px",
};

const mapsIconWrapper: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "50%",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#d6b77b",
  marginRight: "8px",
  marginLeft: "0px",
  fontSize: "20px", // tamaño del icono dentro
};

const HotelSuggestions: React.FC = () => {
  const hotels: Hotel[] = weddingData.hotels;

  return (
    <div style={{ padding: 20 }}>
      <Title
        className="title-decorative"
        level={2}
        style={{
          textAlign: "center",
          margin: "1rem 0 0",
        }}
      >
        Sugerencias de Hospedaje
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {hotels.map((hotel, idx) => (
          <Col xs={24} sm={12} md={8} key={idx} style={{ display: "flex" }}>
            <Card
              hoverable
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                border: "2px solid #d6b77b",
                borderRadius: 12,
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              cover={
                <div
                  style={{ borderRadius: "12px 12px 0 0", overflow: "hidden" }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: "16px 0 8px",
                      color: "#7a8b75",
                      fontFamily: "'Manjari', sans-serif",
                    }}
                  >
                    {hotel.name}
                  </Title>
                  <img
                    alt={hotel.name}
                    src={hotel.image}
                    style={{
                      width: "80%", // ancho más pequeño que el 100%
                      height: 180,
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto", // centrado horizontal
                    }}
                  />
                </div>
              }
            >
              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#7a8b75",
                    fontFamily: "'Manjari', sans-serif",
                  }}
                >
                  <EnvironmentOutlined /> {hotel.address}
                </Text>
                {hotel.phone && hotel.phone.trim() !== "" && (
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#7a8b75",
                      fontFamily: "'Manjari', sans-serif",
                    }}
                  >
                    <PhoneOutlined /> {hotel.phone}
                  </Text>
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <Button
                  href={hotel.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={mapsButtonStyle}
                >
                  <span style={mapsIconWrapper}>
                    <LocationPinIcon size={20} />
                  </span>
                  <span style={{ lineHeight: "1.1" }}>
                    VER EN
                    <br />
                    GOOGLE MAPS
                  </span>
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HotelSuggestions;
