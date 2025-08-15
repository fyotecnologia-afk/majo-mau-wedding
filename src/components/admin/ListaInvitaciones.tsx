// src/components/admin/ListaInvitaciones.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Table, Typography, message, Space, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

type Respuesta = "SI" | "NO" | null;

interface Invitado {
  id: string;
  nombre: string;
  respuesta: Respuesta;
  principal?: boolean;
  categoria?: string;
}

interface Dedicatoria {
  id: string;
  texto: string;
  fecha: string;
}

interface InvitacionData {
  id: string;
  numeroInvitacion: string;
  url: string;
  familia?: string;
  invitados: Invitado[];
  dedicatorias: Dedicatoria[];
}

export default function ListaInvitaciones() {
  const [datos, setDatos] = useState<InvitacionData[]>([]);
  const [loading, setLoading] = useState(false);

  // Carga automática al montar
  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/invitaciones/lista");
        if (!res.ok) throw new Error("Error al cargar los datos");
        const json = await res.json();
        setDatos(json.datos || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    obtenerDatos();
  }, []);

  const copiarAlPortapapeles = async (url: string) => {
    const textoCompleto = `Estamos muy emocionados por recibirlos en esta celebración tan importante\n${url}`;
    try {
      await navigator.clipboard.writeText(textoCompleto);
      message.success("Texto copiado al portapapeles");
    } catch {
      message.error("No se pudo copiar el texto");
    }
  };

  const columnas = [
    {
      title: "Número Invitación",
      dataIndex: "numeroInvitacion",
      key: "numeroInvitacion",
      fixed: "left" as const,
    },
    {
      title: "Familia",
      dataIndex: "familia",
      key: "familia",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <Space direction="vertical" size={4} style={{ maxWidth: 200 }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              verticalAlign: "bottom",
            }}
            title={url}
          >
            {url}
          </a>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => copiarAlPortapapeles(url)}
          >
            Copiar
          </Button>
        </Space>
      ),
    },
    {
      title: "Invitados",
      dataIndex: "invitados",
      key: "invitados",
      render: (invitados: Invitado[]) => (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {invitados.map((inv) => (
            <li key={inv.id}>
              {inv.nombre} —{" "}
              <strong>
                {inv.respuesta === "SI"
                  ? "Confirmado"
                  : inv.respuesta === "NO"
                  ? "No asistirá"
                  : "Sin respuesta"}
              </strong>
              {inv.principal ? " (Principal)" : ""}
              {inv.categoria ? ` [${inv.categoria}]` : ""}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Dedicatorias",
      dataIndex: "dedicatorias",
      key: "dedicatorias",
      render: (dedicatorias: Dedicatoria[]) =>
        dedicatorias.length > 0 ? (
          <div>
            {dedicatorias.map((d) => (
              <div
                key={d.id}
                style={{
                  marginBottom: "0.5rem",
                  padding: "0.5rem",
                  background: "#fafafa",
                  borderRadius: "4px",
                }}
              >
                <small style={{ color: "#888" }}>
                  {new Date(d.fecha).toLocaleString()}
                </small>
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{d.texto}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay dedicatorias</p>
        ),
    },
  ];

  return (
    <div style={{ padding: "0" }}>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Listado de invitaciones para compartir
      </Typography.Title>

      {datos.length > 0 && (
        <Table
          columns={columnas}
          dataSource={datos}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
