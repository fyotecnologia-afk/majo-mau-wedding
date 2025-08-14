// src/components/invitation/FormularioConfirmacion.tsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Alert,
  Card,
  Steps,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

type Invitado = {
  id: string;
  nombre: string;
  respuesta: "SI" | "NO" | null;
};

type ConfirmacionInvitado = {
  invitadoId: string;
  respuesta: "SI" | "NO";
};

type Confirmacion = {
  confirmacionInvitados: ConfirmacionInvitado[];
};

type InvitacionAPIResponse = {
  exists: boolean;
  estado: string;
  invitados: { id: string; nombre: string }[];
  confirmaciones: Confirmacion[];
  dedicatoria?: string;
};

type TipoMensaje = "success" | "info" | "warning" | "error";

type ConfirmInvitationProps = {
  numero?: string | null;
};

// --- Fecha límite ---
const FECHA_LIMITE = "2025-10-17";
const [yy, mm, dd] = FECHA_LIMITE.split("-").map(Number);
const fechaFormateada = new Date(yy, mm - 1, dd).toLocaleDateString("es-MX", {
  day: "numeric",
  month: "long",
});
const fechaCorte = new Date(yy, mm - 1, dd, 23, 59, 59, 999);

export default function ConfirmInvitation({
  numero: numeroProp,
}: ConfirmInvitationProps) {
  const [form] = Form.useForm();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [confirmacionesCount, setConfirmacionesCount] = useState(0);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: TipoMensaje;
    texto: string;
  } | null>(null);
  const [dedicatoria, setDedicatoria] = useState("");

  const cerradoPorFecha = new Date().getTime() > fechaCorte.getTime();
  const maxIntentosAlcanzados = confirmacionesCount >= 2;

  // Precargar número si viene por props
  useEffect(() => {
    if (numeroProp) form.setFieldsValue({ numero: numeroProp });
  }, [numeroProp, form]);

  // Cargar dedicatoria al entrar a step 1
  useEffect(() => {
    if (currentStep === 1) form.setFieldsValue({ dedicatoria });
  }, [currentStep, dedicatoria, form]);

  const buscarInvitacion = async () => {
    const numero = form.getFieldValue("numero")?.trim();
    if (!numero) {
      setMensaje({ tipo: "error", texto: "Ingresa un número de invitación" });
      return;
    }
    setMensaje(null);

    try {
      const res = await fetch(
        `/api/invitaciones/${encodeURIComponent(numero)}`
      );
      if (!res.ok) throw new Error("Invitación no encontrada");
      const data: InvitacionAPIResponse = await res.json();

      const invitadosConRespuesta = data.invitados.map((inv) => {
        let respuesta: "SI" | "NO" | null = null;
        for (const confirmacion of data.confirmaciones) {
          const cInvitado = confirmacion.confirmacionInvitados.find(
            (ci) => ci.invitadoId === inv.id
          );
          if (cInvitado) {
            respuesta = cInvitado.respuesta;
            break;
          }
        }
        return { ...inv, respuesta };
      });

      setInvitados(invitadosConRespuesta);
      setConfirmacionesCount(data.confirmaciones.length || 0);
      setDedicatoria(data.dedicatoria || "");

      const preSeleccionados = invitadosConRespuesta
        .filter((inv) => inv.respuesta === "SI")
        .map((inv) => inv.id);
      setSeleccionados(preSeleccionados);

      setCurrentStep(data.confirmaciones.length >= 2 ? 2 : 1);
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error buscando invitación",
      });
      setInvitados([]);
      setSeleccionados([]);
      setCurrentStep(0);
      setDedicatoria("");
      form.resetFields();
    }
  };

  const enviarConfirmacion = async () => {
    const dedicatoriaForm = form.getFieldValue("dedicatoria")?.trim() || "";
    if (seleccionados.length === 0 && dedicatoriaForm === "") {
      setMensaje({
        tipo: "error",
        texto: "Selecciona al menos un invitado o escribe una dedicatoria",
      });
      return;
    }

    if (cerradoPorFecha) {
      setMensaje({
        tipo: "warning",
        texto: `La fecha límite para confirmar (${fechaFormateada}) ya pasó.`,
      });
      return;
    }

    setEnviando(true);
    setMensaje(null);

    try {
      const numero = form.getFieldValue("numero");
      const res = await fetch("/api/invitaciones/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          asistentes: seleccionados,
          dedicatoria: dedicatoriaForm,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al confirmar");
      }

      setMensaje({ tipo: "success", texto: "¡Confirmado correctamente!" });
      setDedicatoria(dedicatoriaForm);
      setConfirmacionesCount((c) => c + 1);
      setCurrentStep(2);
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error al enviar confirmación",
      });
    } finally {
      setEnviando(false);
    }
  };

  const editarMiConfirmacion = async () => {
    await buscarInvitacion();
    setCurrentStep(1);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 24,
          background: "linear-gradient(180deg, #F6F1EB 0%, #fffef8 100%)",
          boxShadow:
            "0 12px 24px rgba(122, 139, 117, 0.15), 0 8px 16px rgba(203, 178, 120, 0.3)",
          border: `1px solid #CBB278`,
        }}
        title={
          <>
            <Title
              level={2}
              style={{
                textAlign: "center",
                fontSize: "clamp(1.2rem, 5vw, 2rem)",
                margin: "1rem 0 0",
                wordBreak: "break-word",
                whiteSpace: "normal",
                overflowWrap: "break-word",
              }}
              className="title-decorative"
            >
              Confirma tu asistencia
            </Title>
            <Text
              style={{
                display: "block",
                textAlign: "center",
                color: "#c6b687",
                fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                wordBreak: "break-word",
                whiteSpace: "normal",
                margin: "0 auto",
                lineHeight: 1.5,
                fontWeight: 100,
              }}
            >
              Nos encantará contar contigo. Por favor confirma tu asistencia
              antes del <strong>{fechaFormateada}</strong> para ayudarnos a
              preparar todo con cariño.
            </Text>
          </>
        }
      >
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            {
              title: "Buscar",
              icon: <MailOutlined />,
              className: "font-manjari",
            },
            {
              title: "Seleccionar",
              icon: <UserOutlined />,
              className: "font-manjari",
            },
            {
              title: "Confirmado",
              icon: <CheckCircleOutlined />,
              className: "font-manjari",
            },
          ]}
        />

        {(cerradoPorFecha || maxIntentosAlcanzados) && (
          <Alert
            message={
              maxIntentosAlcanzados
                ? "Límite de intentos alcanzado"
                : "Confirmación cerrada por fecha"
            }
            description={
              maxIntentosAlcanzados
                ? "Ya se han realizado los dos intentos permitidos. Ponte en contacto con los novios."
                : `La fecha límite para confirmar (${fechaFormateada}) ya pasó.`
            }
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            className="font-manjari"
          />
        )}

        {!cerradoPorFecha && !maxIntentosAlcanzados && currentStep === 0 && (
          <Form form={form} layout="vertical" onFinish={buscarInvitacion}>
            <Form.Item
              label="Número de invitación"
              name="numero"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu número de invitación",
                },
              ]}
              className="font-manjari"
            >
              <Input
                placeholder="Comienza por MM"
                className="font-manjari"
                style={{ borderRadius: 8, padding: 12, color: "#000000" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "#CBB278",
                  borderColor: "#CBB278",
                  borderRadius: 8,
                  fontWeight: "bold",
                }}
              >
                Buscar invitados
              </Button>
            </Form.Item>
            {mensaje && (
              <Alert
                message={mensaje.texto}
                type={mensaje.tipo}
                showIcon
                style={{ marginTop: 5 }}
                className="font-manjari"
              />
            )}
          </Form>
        )}

        {!cerradoPorFecha && !maxIntentosAlcanzados && currentStep === 1 && (
          <>
            <Alert
              message="Selecciona quién asistirá"
              description="Marca los nombres que confirmarán asistencia."
              type="info"
              showIcon
              style={{ marginBottom: 5 }}
              className="font-manjari"
            />
            <Form form={form} layout="vertical" onFinish={enviarConfirmacion}>
              <Form.Item label="¿Quiénes asistirán?">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={seleccionados}
                  onChange={setSeleccionados}
                  className="font-manjari"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {invitados.map(({ id, nombre, respuesta }) => (
                      <Checkbox key={id} value={id}>
                        <span style={{ fontWeight: 500 }}>{nombre}</span>
                        {respuesta === "SI" && (
                          <Text
                            type="success"
                            style={{ marginLeft: 8 }}
                            className="font-manjari"
                          >
                            (Confirmado)
                          </Text>
                        )}
                        {respuesta === "NO" && (
                          <Text
                            type="danger"
                            style={{ marginLeft: 8 }}
                            className="font-manjari"
                          >
                            (No asistirá)
                          </Text>
                        )}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="Dedicatoria (opcional)"
                name="dedicatoria"
                className="font-manjari"
              >
                <TextArea
                  rows={4}
                  placeholder="Escribe unas palabras para nosotros..."
                  className="font-manjari"
                  style={{ borderRadius: 8, color: "#000000ff" }}
                />
              </Form.Item>

              {mensaje && (
                <Alert
                  message={mensaje.texto}
                  type={mensaje.tipo}
                  showIcon
                  style={{ marginBottom: 5 }}
                  className="font-manjari"
                />
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={enviando}
                  disabled={
                    seleccionados.length === 0 &&
                    !form.getFieldValue("dedicatoria")
                  }
                  block
                  style={{
                    backgroundColor: "#c6b687",
                    borderColor: "#c6b687",
                    borderRadius: 8,
                    fontWeight: "bold",
                  }}
                >
                  Confirmar
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {currentStep === 2 && !cerradoPorFecha && !maxIntentosAlcanzados && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
            />
            <Title
              level={4}
              style={{ color: "#c6b687" }}
              className="font-manjari"
            >
              ¡Gracias por confirmar!
            </Title>
            <Text style={{ color: "#c6b687" }} className="font-manjari">
              Estamos felices de contar contigo en este evento tan especial.
            </Text>
            <Button
              type="primary"
              onClick={editarMiConfirmacion}
              style={{
                backgroundColor: "#CBB278",
                borderColor: "#CBB278",
                borderRadius: 8,
                fontWeight: "bold",
                marginTop: 24,
              }}
              block
            >
              Editar mi confirmación
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
