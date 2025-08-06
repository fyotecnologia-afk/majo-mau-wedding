import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Hotel {
  name: string;
  address: string;
  phone?: string;
  mapsLink: string;
  image: string;
}

const hotels: Hotel[] = [
  {
    name: "Hotel Central Plaza",
    address: "Av. Principal 123, Ciudad",
    phone: "+52 123 456 7890",
    mapsLink: "https://goo.gl/maps/abcdefg1234567",
    image: "/images/hotel1.jpg",
  },
  {
    name: "Hotel Posada Señorial",
    address: "Calle Falsa 456, Ciudad",
    phone: "+52 098 765 4321",
    mapsLink: "https://goo.gl/maps/hijklmn89101112",
    image: "/images/hotel2.jpg",
  },
  {
    name: "Hotel Boutique La Fiesta",
    address: "Boulevard Central 789, Ciudad",
    phone: "+52 555 666 7777",
    mapsLink: "https://goo.gl/maps/opqrstuv13141516",
    image: "/images/hotel3.jpg",
  },
];

const HotelSuggestions: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Hoteles Cercanos al Salón de Recepción</Title>
      <Row gutter={[16, 16]}>
        {hotels.map((hotel, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card
              hoverable
              cover={
                <img
                  alt={hotel.name}
                  src={hotel.image}
                  style={{ borderRadius: 12, height: 180, objectFit: "cover" }}
                />
              }
            >
              <Title level={4}>{hotel.name}</Title>
              <Text>
                <EnvironmentOutlined /> {hotel.address}
              </Text>
              <br />
              {hotel.phone && (
                <>
                  <Text>
                    <PhoneOutlined /> {hotel.phone}
                  </Text>
                  <br />
                </>
              )}
              <Button
                type="link"
                href={hotel.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
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
