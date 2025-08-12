"use client";

import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { CarOutlined, LinkOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";

const { Title } = Typography;

interface RentCarOption {
  name: string;
  text?: string;
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
          margin: "1rem 0 0",
        }}
      >
        Renta de autos
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {options.map((option, idx) => (
          <Col xs={24} sm={24} md={12} key={idx}>
            <Card
              className="custom-family-card font-manjari"
              hoverable
              style={{
                borderRadius: 12,
                border: "1px solid #d6b77b",
                padding: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                )}

                <div style={{ flex: 1, textAlign: "left" }}>
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: "#7a8b75",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {option.name}
                  </Title>
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      color: "#7a8b75",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {option.text}
                  </Title>
                  <Button
                    type="link"
                    href={`https://${option.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ paddingLeft: 0 }}
                  >
                    {idx === 0 ? "Visitar sitio" : "Solicítalo aquí"}
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RentCarsList;
