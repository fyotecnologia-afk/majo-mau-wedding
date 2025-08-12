import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Divider,
  Alert,
  Card,
  Steps,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;

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
  const { form } = weddingData;

  const [numero, setNumero] = useState("");
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [dedicatoria, setDedicatoria] = useState("");
  const [confirmacionesCount, setConfirmacionesCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: TipoMensaje;
    texto: string;
  } | null>(null);

  const buscarInvitacion = async () => {
    if (!numero.trim()) {
      setMensaje({ tipo: "error", texto: "Ingresa un número de invitación" });
      return;
    }
    setMensaje(null);

    try {
      const res = await fetch(
        `/api/invitaciones/${encodeURIComponent(numero.trim())}`
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
      setDedicatoria(data.dedicatoria || "");
      setConfirmacionesCount(data.confirmaciones.length || 0);
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
    }
  };

  const enviarConfirmacion = async () => {
    if (seleccionados.length === 0 && dedicatoria.trim() === "") {
      setMensaje({
        tipo: "error",
        texto: "Selecciona al menos un invitado o escribe una dedicatoria",
      });
      return;
    }
    setEnviando(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/invitaciones/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          asistentes: seleccionados,
          dedicatoria,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al confirmar");
      }
      setMensaje({ tipo: "success", texto: "¡Confirmado correctamente!" });
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

  if (confirmacionesCount >= 2) {
    return (
      <Card style={{ maxWidth: 600, margin: "2rem auto" }}>
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
    <div style={{ maxWidth: 700, margin: "3rem auto", padding: 24 }}>
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
                margin: "1rem 0 0",
                wordBreak: "break-word",
                whiteSpace: "normal",
                overflowWrap: "break-word",
              }}
              className="title-decorative"
            >
              Confirma tu asistencia
            </Title>

            {/* Mensaje desde JSON */}
            {form && (
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#c6b687",
                  fontSize: 16,
                  maxWidth: 600,
                  margin: "1rem auto 0 auto",
                  lineHeight: 1.5,
                }}
              >
                {form}
              </Text>
            )}
          </>
        }
      >
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
          responsive
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

        {/* Paso 1: Buscar */}
        {currentStep === 0 && (
          <Form
            layout="vertical"
            onFinish={buscarInvitacion}
            className="font-manjari"
          >
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
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej. 1234"
                style={{
                  borderRadius: 8,
                  padding: 12,
                }}
                className="font-manjari"
              />
            </Form.Item>
            <Form.Item className="font-manjari">
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

        {/* Paso 2: Confirmar */}
        {currentStep === 1 && (
          <>
            <Alert
              message="Selecciona quién asistirá"
              description="Marca los nombres que confirmarán asistencia."
              type="info"
              showIcon
              style={{ marginBottom: 5 }}
              className="font-manjari"
            />

            <Form
              layout="vertical"
              onFinish={enviarConfirmacion}
              className="font-manjari"
            >
              <Form.Item label="¿Quiénes asistirán?">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={seleccionados}
                  onChange={setSeleccionados}
                  className="font-manjari"
                >
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    className="font-manjari"
                  >
                    {invitados.map((invitado) => (
                      <Checkbox key={invitado.id} value={invitado.id}>
                        <span style={{ fontWeight: 500 }}>
                          {invitado.nombre}
                        </span>
                        {invitado.respuesta === "SI" && (
                          <Text
                            type="success"
                            style={{ marginLeft: 8 }}
                            className="font-manjari"
                          >
                            (Confirmado)
                          </Text>
                        )}
                        {invitado.respuesta === "NO" && (
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
                className="font-manjari"
              >
                <TextArea
                  rows={4}
                  value={dedicatoria}
                  onChange={(e) => setDedicatoria(e.target.value)}
                  placeholder="Escribe unas palabras para nosotros..."
                  style={{ borderRadius: 8 }}
                  className="font-manjari"
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
                    seleccionados.length === 0 && dedicatoria.trim() === ""
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
              onClick={() => setCurrentStep(0)}
              style={{ display: "block", width: "100%", color: "#CBB278" }}
            >
              Volver a buscar otro número
            </Button>
          </>
        )}

        {/* Paso 3: Confirmado */}
        {currentStep === 2 && (
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
            <Divider />
            <Button
              type="primary"
              onClick={() => {
                setNumero("");
                setInvitados([]);
                setSeleccionados([]);
                setDedicatoria("");
                setMensaje(null);
                setConfirmacionesCount(0);
                setCurrentStep(0);
                setEnviando(false);
              }}
              style={{
                backgroundColor: "#CBB278",
                borderColor: "#CBB278",
                borderRadius: 8,
                fontWeight: "bold",
              }}
              block
              className="font-manjari"
            >
              Confirmar otro número
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
