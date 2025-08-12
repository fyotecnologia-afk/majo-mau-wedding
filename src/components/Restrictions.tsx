import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Text } = Typography;

const Restrictions: React.FC = () => {
  const restrictions = weddingData.restrictions?.restriction ?? [];

  if (!restrictions.length) return null;

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{}}>
        {restrictions.map((item, index) => (
          <React.Fragment key={index}>
            <Text
              style={{ fontSize: 15, lineHeight: 1.6, margin: "0 2px" }}
              className="font-manjari"
            >
              {item}
            </Text>
            {index !== restrictions.length - 1 && (
              <Text className="font-manjari">|</Text>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Restrictions;
