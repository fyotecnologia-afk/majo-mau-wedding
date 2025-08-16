// src/components/admin/AdminList.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  Modal,
  message,
  Pagination,
  Select,
  Switch,
  notification,
} from "antd";
import { useRouter } from "next/router";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PAGE_SIZE = 10;

export default function AdminList() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<string | undefined>(undefined);
  const [especial, setEspecial] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ultimoNumero, setUltimoNumero] = useState<string>("");

  const spring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  });

  const fetchItems = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });

    if (q) params.set("q", q);
    if (estado) params.set("estado", estado);
    if (especial !== undefined) params.set("especial", String(especial));

    const res = await fetch(`/api/admin/invitaciones?${params.toString()}`);
    const json = await res.json();

    const items = (json.items || []).map((item: any) => ({
      ...item,
      _count: item._count || { invitados: 0, confirmaciones: 0 },
    }));

    setData(items);
    setTotal(json.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [page, estado, especial]);

  const onSearch = () => {
    setPage(1);
    fetchItems();
  };

  const exportToExcel = async () => {
    try {
      // Traemos todos los datos, sin paginación
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (estado) params.set("estado", estado);
      if (especial !== undefined) params.set("especial", String(especial));

      // pageSize grande para traer todos o usar endpoint especial
      params.set("page", "1");
      params.set("pageSize", "10000"); // asumir que 10k cubre todos

      const res = await fetch(`/api/admin/invitaciones?${params.toString()}`);
      const json = await res.json();

      const rows = (json.items || []).flatMap((inv: any) =>
        (inv.invitados || []).map((guest: any) => ({
          Tipo: inv.tipo ?? "",
          "Numero de invitacion": inv.numero ?? "",
          Familia: inv.familia ?? "",
          Principal: guest.principal ? 1 : 0,
          "Nombre Invitado": guest.nombre ?? "",
          "Adulto | Niño": guest.categoria ?? "",
          Especial: guest.especial ? 1 : 0,
          CONFIRMADO:
            guest.confirmacionInvitados?.[0]?.respuesta === "SI"
              ? "CONFIRMADO"
              : guest.confirmacionInvitados?.[0]?.respuesta === "NO"
              ? "NO CONFIRMADO"
              : "SIN RESPUESTA",
        }))
      );

      const safeRows =
        rows.length > 0 ? rows : [{ Tipo: "", "Numero de invitacion": "" }];

      const ws = XLSX.utils.json_to_sheet(safeRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invitados");

      if (ws["!ref"]) {
        (ws as any)["!autofilter"] = { ref: ws["!ref"] };
      }

      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buf]), `invitados.xlsx`);
    } catch (e: any) {
      message.error("Error al exportar: " + e.message);
    }
  };

  return (
    <animated.div
      style={{
        ...spring,
        maxWidth: "100%",
        margin: "0 auto",
        overflowX: "auto",
      }}
    >
      <Space style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <Input.Search
          placeholder="Buscar por número, familia, tipo, hostedBy..."
          allowClear
          enterButton="Buscar"
          onSearch={onSearch}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 260, flex: "1 1 300px" }}
        />

        <Select
          placeholder="Estado"
          allowClear
          style={{ width: 180 }}
          value={estado}
          onChange={setEstado}
          options={[
            { value: "ACTIVO", label: "ACTIVO" },
            { value: "INACTIVO", label: "INACTIVO" },
          ]}
        />

        <Select
          placeholder="Especial"
          allowClear
          style={{ width: 180 }}
          value={especial === undefined ? undefined : especial ? "SI" : "NO"}
          onChange={(val) => {
            if (val === "SI") setEspecial(true);
            else if (val === "NO") setEspecial(false);
            else setEspecial(undefined);
            setPage(1);
            fetchItems();
          }}
          options={[
            { value: "SI", label: "Sí" },
            { value: "NO", label: "No" },
          ]}
        />
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Nueva invitación
        </Button>

        <Button onClick={exportToExcel} type="default">
          Exportar a Excel
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={[
          { title: "Número", dataIndex: "numero", responsive: ["sm"] },
          { title: "Familia", dataIndex: "familia", responsive: ["sm"] },
          { title: "Tipo", dataIndex: "tipo", responsive: ["md"] },
          { title: "Hosted By", dataIndex: "hostedBy", responsive: ["md"] },
          {
            title: "Estado",
            dataIndex: "estado",
            render: (v, r) => (
              <Switch
                checked={v === "ACTIVO"}
                checkedChildren="ACTIVO"
                unCheckedChildren="INACTIVO"
                onChange={async (checked) => {
                  const nuevoEstado = checked ? "ACTIVO" : "INACTIVO";
                  try {
                    const res = await fetch(`/api/admin/invitaciones/${r.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ estado: nuevoEstado }),
                    });
                    if (!res.ok) throw new Error("Error al actualizar estado");
                    message.success(`Estado actualizado a ${nuevoEstado}`);
                    fetchItems();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}
              />
            ),
            responsive: ["sm"],
          },
          {
            title: "Flags",
            render: (_, r) => (
              <Space size="small" wrap>
                {r.invitados?.some((inv: any) => inv.especial) && (
                  <Tag color="yellow">Especial</Tag>
                )}
              </Space>
            ),
            responsive: ["md"],
          },
          {
            title: "Conteo",
            render: (_, r) => (
              <Space size="small" wrap>
                <Tag>Invitados: {r.conteoInvitados}</Tag>
                <Tag>Conf.: {r.conteoConfirmados}</Tag>
                <Tag>No Conf.: {r.conteoNoConfirmados}</Tag>
                <Tag>Sin resp.: {r.conteoSinRespuesta}</Tag>
              </Space>
            ),
            responsive: ["sm"],
          },
          {
            title: "Acciones",
            render: (_, r) => (
              <Space>
                <Link href={`/admin/${r.id}`}>
                  <Button>Editar</Button>
                </Link>
              </Space>
            ),
          },
        ]}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>

      {/* Modal para nueva invitación */}
      <Modal
        title="Nueva invitación"
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        footer={null}
        destroyOnHidden
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {React.createElement(
            require("@/components/admin/InvitationForm").default,
            {
              onSubmit: async (values: any) => {
                const res = await fetch("/api/admin/invitaciones", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!res.ok) {
                  const err = await res.json();
                  message.error(err.error || "Error al crear");
                  return;
                }

                const created = await res.json();
                setUltimoNumero(created.numero);
                notification.success({
                  message: `Invitación creada`,
                  description: `Número de invitación: ${created.numero}`,
                  duration: 0,
                });
                setOpenCreate(false);
                fetchItems();
              },
              submitText: "Crear",
            }
          )}
        </Space>
      </Modal>
    </animated.div>
  );
}
