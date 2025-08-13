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

  // Precargar número si viene por props
  useEffect(() => {
    if (numeroProp) {
      form.setFieldsValue({ numero: numeroProp });
    }
  }, [numeroProp, form]);

  // Cargar dedicatoria cuando se cambia currentStep y tenemos dedicatoria almacenada en estado
  useEffect(() => {
    if (currentStep === 1) {
      form.setFieldsValue({ dedicatoria });
    }
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

      // Carga dedicatoria en estado para luego cargar en el form (por useEffect)
      setDedicatoria(data.dedicatoria || "");

      const preSeleccionados = invitadosConRespuesta
        .filter((inv) => inv.respuesta === "SI")
        .map((inv) => inv.id);
      setSeleccionados(preSeleccionados);
      setCurrentStep(1);
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

      // Actualiza dedicatoria local para persistir la última confirmación hecha
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

  // Bloquear formulario si ya hay 2 o más confirmaciones
  if (confirmacionesCount >= 2) {
    return (
      <Card style={{ maxWidth: 600, margin: "0 auto" }}>
        <Alert
          message="Límite alcanzado"
          description="Ya no se puede editar. Se alcanzó el límite de confirmaciones."
          type="warning"
          showIcon
        />
      </Card>
    );
  }

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
                wordBreak: "break-word", // 🔑 Evita corte forzado de palabras
                whiteSpace: "normal", // 🔑 Permite saltos de línea
                overflowWrap: "break-word", // 🔑 Permite ajuste automático
              }}
              className="title-decorative"
            >
              Confirma tu asistencia
            </Title>
            {form && (
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#c6b687",
                  fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  margin: "0 auto 0 auto",
                  lineHeight: 1.5,
                  fontWeight: 100,
                }}
              >
                Nos encantará contar contigo. Por favor confirma tu asistencia
                antes del <strong> 17 de octubre</strong> para ayudarnos a
                preparar todo con cariño.
              </Text>
            )}
          </>
        }
      >
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            { title: "Buscar", icon: <MailOutlined /> },
            { title: "Seleccionar", icon: <UserOutlined /> },
            { title: "Confirmado", icon: <CheckCircleOutlined /> },
          ]}
        />

        {currentStep === 0 && (
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
            >
              <Input
                placeholder="Ej. 1234"
                style={{ borderRadius: 8, padding: 12 }}
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
              />
            )}
          </Form>
        )}

        {currentStep === 1 && (
          <>
            <Alert
              message="Selecciona quién asistirá"
              description="Marca los nombres que confirmarán asistencia."
              type="info"
              showIcon
              style={{ marginBottom: 5 }}
            />

            <Form form={form} layout="vertical" onFinish={enviarConfirmacion}>
              <Form.Item label="¿Quiénes asistirán?">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={seleccionados}
                  onChange={setSeleccionados}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {invitados.map(({ id, nombre, respuesta }) => (
                      <Checkbox key={id} value={id}>
                        <span style={{ fontWeight: 500 }}>{nombre}</span>
                        {respuesta === "SI" && (
                          <Text type="success" style={{ marginLeft: 8 }}>
                            (Confirmado)
                          </Text>
                        )}
                        {respuesta === "NO" && (
                          <Text type="danger" style={{ marginLeft: 8 }}>
                            (No asistirá)
                          </Text>
                        )}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="Dedicatoria (opcional)" name="dedicatoria">
                <TextArea
                  rows={4}
                  placeholder="Escribe unas palabras para nosotros..."
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              {mensaje && (
                <Alert
                  message={mensaje.texto}
                  type={mensaje.tipo}
                  showIcon
                  style={{ marginBottom: 5 }}
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
            <Button
              type="link"
              onClick={() => {
                setCurrentStep(0);
                setMensaje(null);
                setInvitados([]);
                setSeleccionados([]);
                form.resetFields(["dedicatoria"]);
                setDedicatoria("");
              }}
              style={{ display: "block", width: "100%", color: "#CBB278" }}
            >
              Volver a buscar otro número
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
            />
            <Title level={4} style={{ color: "#c6b687" }}>
              ¡Gracias por confirmar!
            </Title>
            <Text style={{ color: "#c6b687" }}>
              Estamos felices de contar contigo en este evento tan especial.
            </Text>
            <Button
              type="primary"
              onClick={() => {
                setCurrentStep(0);
                setMensaje(null);
                setInvitados([]);
                setSeleccionados([]);
                form.resetFields();
                setEnviando(false);
                setConfirmacionesCount(0);
                setDedicatoria("");
              }}
              style={{
                backgroundColor: "#CBB278",
                borderColor: "#CBB278",
                borderRadius: 8,
                fontWeight: "bold",
                marginTop: 24,
              }}
              block
            >
              Confirmar otro número
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
