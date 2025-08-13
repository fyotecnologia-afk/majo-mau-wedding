import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import weddingData from "@/data/weddingData.json";
import LocationPinIcon from "./LocationPin";

const { Title, Text } = Typography;

const cardStyle = {
  border: "3px solid rgb(225, 203, 163)",
  borderRadius: 2,
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "40vw", // relativo al ancho de la ventana
  maxHeight: "300px", // límite en pantallas grandes
  borderRadius: 6,
  objectFit: "contain",
};

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

const CeremonyCard: React.FC<{ ceremony: any }> = ({ ceremony }) => (
  <Card hoverable style={cardStyle}>
    <Title
      level={4}
      style={{ textAlign: "center", margin: 0, color: "#7a8b75" }}
      className="font-manjari"
    >
      {ceremony.title}
    </Title>
    <img src={ceremony.imgUrl} alt={ceremony.title} style={imageStyle} />
    <Text
      strong
      style={{ display: "block", textAlign: "center", marginBottom: 0 }}
      className="font-manjari"
    >
      {ceremony.location}
    </Text>
    <Text
      style={{ display: "block", textAlign: "center", marginBottom: 0 }}
      className="font-manjari"
    >
      {ceremony.date}
    </Text>
    <Text
      style={{ display: "block", textAlign: "center", marginBottom: 12 }}
      className="font-manjari"
    >
      {ceremony.address}
    </Text>
    <div style={{ textAlign: "center" }}>
      <Button
        href={ceremony.mapsLink}
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
);

const ReceptionCard: React.FC<{ reception: any }> = ({ reception }) => (
  <Card hoverable style={cardStyle}>
    <Title
      level={4}
      style={{ textAlign: "center", margin: 0, color: "#7a8b75" }}
      className="font-manjari"
    >
      {reception.title}
    </Title>
    <img src={reception.imgUrl} alt={reception.title} style={imageStyle} />
    <Text
      strong
      style={{ display: "block", textAlign: "center", marginBottom: 0 }}
      className="font-manjari"
    >
      {reception.location}
    </Text>
    <Text
      style={{ display: "block", textAlign: "center", marginBottom: 0 }}
      className="font-manjari"
    >
      {reception.date}
    </Text>
    <Text
      style={{ display: "block", textAlign: "center", marginBottom: 12 }}
      className="font-manjari"
    >
      {reception.address}
    </Text>
    <div style={{ textAlign: "center" }}>
      <Button
        href={reception.mapsLink}
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
);

const WeddingSchedule: React.FC = () => {
  const data = weddingData as any;

  return (
    <div className="font-manjari">
      <Title level={2} className="title-decorative">
        ¿Cuándo y dónde?
      </Title>

      <Row gutter={[16, 16]}>
        {data.ceremonies.map((ceremony: any, index: number) => (
          <Col xs={24} sm={24} md={12} key={index}>
            <CeremonyCard ceremony={ceremony} />
          </Col>
        ))}
        <Col xs={24} sm={24} md={12}>
          <ReceptionCard reception={data.reception} />
        </Col>
      </Row>
    </div>
  );
};

export default WeddingSchedule;
