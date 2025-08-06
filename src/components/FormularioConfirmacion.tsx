import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Divider,
  message,
  Card,
  Steps,
  Alert,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;
type Mensaje = {
  tipo: "success" | "error" | "info" | "warning";
  texto: string;
};
type Invitado = {
  id: string;
  nombre: string;
};
type ConfirmInvitationProps = {
  numero?: string | null;
};

export default function ConfirmInvitation({
  numero: numeroProp,
}: ConfirmInvitationProps) {
  const [numero, setNumero] = useState(numeroProp || "");
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [confirmaciones, setConfirmaciones] = useState(0);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [dedicatoria, setDedicatoria] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Buscar invitación
  const buscarInvitacion = async () => {
    try {
      const res = await fetch(
        `/api/invitaciones/${encodeURIComponent(numero.trim())}`
      );
      if (!res.ok) {
        setMensaje({
          tipo: "error",
          texto: "Número de invitación no encontrado",
        });
        setInvitados([]);
        setConfirmaciones(0);
        return;
      }
      const data = await res.json();
      console.log(data);
      setInvitados(data.invitados);
      setConfirmaciones(data.confirmaciones);
      setMensaje(null);
      setSeleccionados([]);
      setDedicatoria("");
      setCurrentStep(1);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error buscando la invitación" });
    }
  };

  // Enviar confirmación
  const enviarConfirmacion = async () => {
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
      if (res.ok) {
        setMensaje({ tipo: "success", texto: "¡Confirmado correctamente!" });
        setCurrentStep(2);
      } else {
        const errorData = await res.json();
        setMensaje({
          tipo: "error",
          texto: errorData.error || "Error al confirmar",
        });
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al enviar confirmación" });
    }

    setEnviando(false);
  };

  if (confirmaciones >= 2) {
    return (
      <Card
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: 12,
        }}
      >
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
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <Card
        title={
          <Title
            level={3}
            style={{
              marginBottom: 0,
              textAlign: "center",
              fontSize: "clamp(1.2rem, 5vw, 2rem)", // 👈 clave responsiva
              wordBreak: "break-word",
              whiteSpace: "normal",
              lineHeight: 1.3,
            }}
          >
            Confirmación de Invitación
          </Title>
        }
        variant={undefined}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 12 }}
      >
        <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
          <Step title="Buscar" icon={<MailOutlined />} />
          <Step title="Seleccionar" icon={<UserOutlined />} />
          <Step title="Confirmado" icon={<CheckCircleOutlined />} />
        </Steps>

        {currentStep === 0 && (
          <Form layout="vertical" onFinish={buscarInvitacion}>
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
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej. 1234"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Buscar invitados
              </Button>
            </Form.Item>
            {mensaje && (
              <Alert
                message={mensaje.texto}
                type={mensaje.tipo}
                showIcon
                style={{ marginTop: 16 }}
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
              style={{ marginBottom: 16 }}
            />

            <Form layout="vertical" onFinish={enviarConfirmacion}>
              <Form.Item label="¿Quiénes asistirán?">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={seleccionados}
                  onChange={setSeleccionados}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {invitados.map((invitado) => (
                      <Checkbox key={invitado.id} value={invitado.id}>
                        {invitado.nombre}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="Dedicatoria (opcional)">
                <TextArea
                  rows={4}
                  value={dedicatoria}
                  onChange={(e) => setDedicatoria(e.target.value)}
                  placeholder="Escribe unas palabras para nosotros..."
                />
              </Form.Item>

              {mensaje && (
                <Alert
                  message={mensaje.texto}
                  type={mensaje.tipo}
                  showIcon
                  style={{ marginBottom: 16 }}
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
                >
                  Confirmar
                </Button>
              </Form.Item>
            </Form>
            <Button type="link" onClick={() => setCurrentStep(0)} block>
              Volver a buscar otro número
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
            />
            <Title level={4}>¡Gracias por confirmar!</Title>
            <Text>
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
                setConfirmaciones(0);
                setCurrentStep(0);
                setEnviando(false);
              }}
            >
              Confirmar otro número
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
