// src/components/admin/ListaInvitaciones.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Table, Typography, message, Space, Button, Collapse } from "antd";
import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Panel } = Collapse;

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
    const textoCompleto = `Invitación completa:\n\n${url}`;
    try {
      await navigator.clipboard.writeText(textoCompleto);
      message.success("Texto copiado al portapapeles");
    } catch {
      message.error("No se pudo copiar el texto");
    }
  };

  const exportarExcel = () => {
    if (datos.length === 0) {
      message.warning("No hay datos para exportar");
      return;
    }

    const rows: any[] = [];

    datos.forEach((inv) => {
      const invitadosText = inv.invitados
        .map(
          (i) =>
            `${i.nombre} — ${
              i.respuesta === "SI"
                ? "Confirmado"
                : i.respuesta === "NO"
                ? "No asistirá"
                : "Sin respuesta"
            }${i.principal ? " (Principal)" : ""}${
              i.categoria ? ` [${i.categoria}]` : ""
            }`
        )
        .join("\n");

      // Tomamos hasta 2 dedicatorias por invitación
      const intento1 = inv.dedicatorias[0]
        ? `${new Date(inv.dedicatorias[0].fecha).toLocaleDateString()}\n${
            inv.dedicatorias[0].texto
          }`
        : "No hay dedicatorias";

      const intento2 = inv.dedicatorias[1]
        ? `${new Date(inv.dedicatorias[1].fecha).toLocaleDateString()}\n${
            inv.dedicatorias[1].texto
          }`
        : "No hay dedicatorias";

      rows.push({
        "Número Invitación": inv.numeroInvitacion,
        Familia: inv.familia || "",
        Invitados: invitadosText,
        "Intento 1": intento1,
        "Intento 2": intento2,
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invitaciones");
    XLSX.writeFile(workbook, "Invitaciones.xlsx");
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
          <Collapse>
            {dedicatorias.map((d) => (
              <Panel
                header={`Dedicatoria - ${new Date(
                  d.fecha
                ).toLocaleDateString()}`}
                key={d.id}
              >
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{d.texto}</p>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <p>No hay dedicatorias</p>
        ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportarExcel}
        >
          Exportar a Excel
        </Button>
      </Space>
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
