import React from "react";
import { Typography, Card, Row, Col } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

type Person = {
  names: string[];
  role: string;
};

type FamilyData = {
  parents: Person[];
  godparents: Person[];
};

const FamilySection: React.FC = () => {
  const family: FamilyData = weddingData.family;

  const renderPeople = (list: Person[]) =>
    list.map((person, index) => (
      <Col xs={24} sm={12} md={8} key={index} style={{ marginBottom: 16 }}>
        <Card
          hoverable
          className="custom-family-card"
          style={{
            textAlign: "center",
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "2px solid #d6b77b",
            padding: 5,
          }}
        >
          <Title
            level={4}
            style={{ marginBottom: 4, color: "#7a8b75", fontSize: "1rem" }}
            className="font-manjari"
          >
            {person.names.map((name, i) => (
              <div key={i}>{name}</div>
            ))}
          </Title>
          <Text
            type="secondary"
            style={{ color: "#7a8b75" }}
            className="font-manjari"
          >
            {person.role}
          </Text>
        </Card>
      </Col>
    ));

  return (
    <div>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Title
          level={2}
          className="title-decorative"
          style={{ textAlign: "center", margin: "1rem 0 0" }}
        >
          Nuestros Padres
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {renderPeople(family.parents)}
        </Row>

        <Title
          level={2}
          className="title-decorative"
          style={{ textAlign: "center", margin: "1rem 0 0" }}
        >
          Nuestros Padrinos
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {renderPeople(family.godparents)}
        </Row>
      </div>
    </div>
  );
};

export default FamilySection;
