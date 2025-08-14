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
} from "antd";
import { useRouter } from "next/router";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function AdminList() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.reload();
  };

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

    const res = await fetch(`/api/admin/invitaciones?${params.toString()}`);
    const json = await res.json();

    // Aseguramos que cada registro tenga _count
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
  }, [page, estado]);

  const onSearch = () => {
    setPage(1);
    fetchItems();
  };

  return (
    <animated.div
      style={{
        ...spring,
        padding: 24,
        maxWidth: "100%",
        margin: "0 auto",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <h1>Panel de Invitados</h1>
        <Button onClick={handleLogout}>Cerrar sesión</Button>
      </div>

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
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Nueva invitación
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
            render: (v) =>
              v === "ACTIVO" ? (
                <Tag color="green">ACTIVO</Tag>
              ) : (
                <Tag color="red">INACTIVO</Tag>
              ),
            responsive: ["sm"],
          },
          {
            title: "Flags",
            render: (_, r) => (
              <Space size="small" wrap>
                {typeof r.tanteo === "number" && (
                  <Tag color="blue">Tanteo: {r.tanteo}</Tag>
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

      <Modal
        title="Nueva invitación"
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        footer={null}
        destroyOnHidden
      >
        {React.createElement(
          require("@/components/admin/InvitationForm").default,
          {
            onSubmit: async (values: any) => {
              const res = await fetch("/api/admin/invitaciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              console.log(res);
              if (!res.ok) {
                const err = await res.json();
                message.error(err.error || "Error al crear");
                return;
              }
              message.success("Invitación creada");
              setOpenCreate(false);
              fetchItems();
            },
            submitText: "Crear",
          }
        )}
      </Modal>
    </animated.div>
  );
}
