"use client";

import React from "react";
import { Card, Col, Row, Typography } from "antd";
import {
  InstagramOutlined,
  PhoneOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useTrail, animated } from "@react-spring/web";
import weddingData from "@/data/weddingData.json";

const { Title, Text, Link } = Typography;

interface MakeupArtist {
  name: string;
  phone: string;
  code?: string;
  instagram: string;
  embedUrl?: string;
}

const MakeupCard: React.FC<{ artist: MakeupArtist }> = ({ artist }) => (
  <Card
    hoverable
    style={{
      background: "#fffaf5",
      border: "1px solid #f0e6dd",
      borderRadius: 12,
    }}
    cover={
      artist.embedUrl && (
        <iframe
          title={artist.name}
          src={`https://www.instagram.com/p/${artist.embedUrl}/embed`}
          width="100%"
          height={400}
          frameBorder={0}
          scrolling="no"
          allow="encrypted-media"
          style={{ borderRadius: "12px 12px 0 0" }}
          loading="lazy"
        />
      )
    }
  >
    <Title
      level={4}
      style={{
        marginBottom: 8,
      }}
    >
      {artist.name}
    </Title>

    <a
      href={`tel:${artist.phone}`}
      style={{
        display: "block",
        marginBottom: 6,
        fontSize: 16,

        textDecoration: "none",
      }}
    >
      <PhoneOutlined style={{ marginRight: 8 }} />
      {artist.phone}
    </a>

    {artist.code && (
      <Text
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 16,
        }}
      >
        <TagOutlined style={{ marginRight: 8 }} />
        Código: {artist.code}
      </Text>
    )}

    <Link
      href={`https://${artist.instagram}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: 8,
        fontWeight: 500,
      }}
    >
      <InstagramOutlined style={{ marginRight: 8 }} />
      Ver Instagram
    </Link>
  </Card>
);

const MakeupList: React.FC = () => {
  const artists: MakeupArtist[] = weddingData.makeup;

  const trail = useTrail(artists.length, {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <div style={{ padding: "20px" }}>
      <Title
        className="title-decorative"
        level={2}
        style={{
          textAlign: "center",
          margin: "1rem 0 0",
        }}
      >
        Maquillaje y Peinado
      </Title>

      <Row gutter={[16, 16]}>
        {trail.map((style, index) => (
          <Col xs={24} sm={24} md={12} key={index}>
            <animated.div style={style}>
              <MakeupCard artist={artists[index]} />
            </animated.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MakeupList;
