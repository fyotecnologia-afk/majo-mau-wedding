"use client";

import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { CarOutlined, LinkOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

interface RentCarOption {
  name: string;
  link: string;
  image?: string;
}

const RentCarsList: React.FC = () => {
  const options: RentCarOption[] = weddingData.rent_cars;

  return (
    <div style={{ padding: 20 }}>
      <Title
        className="title-decorative"
        level={2}
        style={{
          textAlign: "center",
          fontSize: "clamp(1.2rem, 5vw, 2rem)", // 👈 clave responsiva
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: 1.3,
        }}
      >
        Opciones para Renta de Autos
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {options.map((option, idx) => (
          <Col xs={24} sm={12} md={8} key={idx} style={{ display: "flex" }}>
            <Card
              hoverable
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
              cover={
                option.image ? (
                  <img
                    alt={option.name}
                    src={option.image}
                    style={{
                      borderRadius: 12,
                      height: 150,
                      objectFit: "contain",
                      backgroundColor: "black",
                    }}
                  />
                ) : undefined
              }
            >
              <div style={{ flex: 1 }}>
                <Title level={4}>
                  <CarOutlined style={{ marginRight: 8 }} />
                  {option.name}
                </Title>
              </div>

              <Button
                type="link"
                href={`https://${option.link}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<LinkOutlined />}
                style={{ marginTop: 12 }}
              >
                Visitar sitio web
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RentCarsList;
