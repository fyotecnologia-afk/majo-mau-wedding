import React from "react";
import { Typography, List } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

const Restrictions: React.FC = () => {
  const restrictions = weddingData.restrictions?.restriction ?? [];

  if (!restrictions.length) return null;

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "3rem auto",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Título */}
      <div style={{ marginBottom: 32, position: "relative", zIndex: 10 }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            margin: "1rem 0 0",
          }}
          className="title-decorative"
        >
          Restricciones
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

      {/* Lista de restricciones */}
      <List
        dataSource={restrictions}
        renderItem={(item) => (
          <List.Item style={{ justifyContent: "center", paddingInline: 0 }}>
            <Text
              style={{
                fontSize: 18,
                fontStyle: "italic",
                color: "#7A8B75",
              }}
            >
              {item}
            </Text>
          </List.Item>
        )}
      />
    </section>
  );
};

export default Restrictions;
