// components/WeddingSchedule.tsx
import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

interface Ceremony {
  title: string;
  date: string;
  location: string;
  address: string;
  mapsLink: string;
  iframe: string;
}

interface Reception {
  title: string;
  date: string;
  location: string;
  address: string;
  mapsLink: string;
  iframe: string;
}

interface WeddingData {
  ceremonies: Ceremony[];
  reception: Reception;
}

const CeremonyCard: React.FC<{ ceremony: Ceremony }> = ({ ceremony }) => (
  <Card
    hoverable
    cover={
      <iframe
        title={ceremony.title}
        src={ceremony.iframe}
        width="100%"
        height={250}
        style={{ border: 0, borderRadius: 12 }}
        loading="lazy"
      />
    }
    style={{ marginBottom: 16 }}
  >
    <Title level={4}>{ceremony.title}</Title>
    <Text>{new Date(ceremony.date).toLocaleString()}</Text>
    <br />
    <Text>{ceremony.location}</Text>
    <br />
    <Text>{ceremony.address}</Text>
    <br />
    <a href={ceremony.mapsLink} target="_blank" rel="noopener noreferrer">
      <EnvironmentOutlined /> Ver en Google Maps
    </a>
  </Card>
);

const ReceptionCard: React.FC<{ reception: Reception }> = ({ reception }) => (
  <Card
    hoverable
    cover={
      <iframe
        title={reception.title}
        src={reception.iframe}
        width="100%"
        height={250}
        style={{ border: 0, borderRadius: 12 }}
        loading="lazy"
      />
    }
    style={{ marginBottom: 16 }}
  >
    <Title level={4}>{reception.title}</Title>
    <Text>{new Date(reception.date).toLocaleString()}</Text>
    <br />
    <Text>{reception.location}</Text>
    <br />
    <Text>{reception.address}</Text>
    <br />
    <a href={reception.mapsLink} target="_blank" rel="noopener noreferrer">
      <EnvironmentOutlined /> Ver en Google Maps
    </a>
  </Card>
);

const WeddingSchedule: React.FC = () => {
  // Puedes tipar weddingData para evitar errores si quieres:
  const data = weddingData as WeddingData;

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={2}
        className="title-decorative"
        style={{
          textAlign: "center",
          margin: "1rem 0 0",
        }}
      >
        ¿Dónde y Cúando?
      </Title>
      <Row gutter={[16, 16]}>
        {data.ceremonies.map((ceremony, index) => (
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
