"use client";

import React, { useState } from "react";
import { Button, Table, Typography, Collapse } from "antd";

type Respuesta = "SI" | "NO" | null;

interface Invitado {
  id: string;
  nombre: string;
  respuesta: Respuesta;
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
  invitados: Invitado[];
  dedicatorias: Dedicatoria[];
}

export default function ListaInvitaciones() {
  const [datos, setDatos] = useState<InvitacionData[]>([]);
  const [loading, setLoading] = useState(false);

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

  const columnas = [
    {
      title: "Número Invitación",
      dataIndex: "numeroInvitacion",
      key: "numeroInvitacion",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
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
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Dedicatorias",
      dataIndex: "dedicatorias",
      key: "dedicatorias",
      render: (dedicatorias: Dedicatoria[]) => (
        <Collapse>
          {dedicatorias.map((d) => (
            <Collapse.Panel
              header={new Date(d.fecha).toLocaleString()}
              key={d.id}
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{d.texto}</p>
            </Collapse.Panel>
          ))}
          {dedicatorias.length === 0 && <p>No hay dedicatorias</p>}
        </Collapse>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <Typography.Title level={3}>
        Módulo Administrativo Invitaciones
      </Typography.Title>
      <Button type="primary" onClick={obtenerDatos} loading={loading}>
        Obtener Datos
      </Button>

      {datos.length > 0 && (
        <Table
          columns={columnas}
          dataSource={datos}
          rowKey="id"
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
}
