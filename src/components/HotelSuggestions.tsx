import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

interface Hotel {
  name: string;
  address: string;
  phone?: string;
  mapsLink: string;
  image: string;
}

const HotelSuggestions: React.FC = () => {
  const hotels: Hotel[] = weddingData.hotels;

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Hoteles Cercanos al Salón de Recepción</Title>
      <Row gutter={[16, 16]} justify="center">
        {hotels.map((hotel, idx) => (
          <Col xs={24} sm={12} md={8} key={idx} style={{ display: "flex" }}>
            <Card
              hoverable
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
              cover={
                <img
                  alt={hotel.name}
                  src={hotel.image}
                  style={{
                    borderRadius: 12,
                    height: 180,
                    objectFit: "cover",
                  }}
                />
              }
            >
              <div style={{ flex: 1 }}>
                <Title level={4}>{hotel.name}</Title>
                <Text>
                  <EnvironmentOutlined /> {hotel.address}
                </Text>
                <br />
                {hotel.phone && hotel.phone.trim() !== "" && (
                  <>
                    <Text>
                      <PhoneOutlined /> {hotel.phone}
                    </Text>
                    <br />
                  </>
                )}
              </div>

              <Button
                type="link"
                href={hotel.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 12 }}
              >
                Ver en Google Maps
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HotelSuggestions;
