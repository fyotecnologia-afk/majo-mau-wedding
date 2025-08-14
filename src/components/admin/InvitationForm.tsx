import React from "react";
import { Form, Input, Switch, InputNumber, Select, Button, Space } from "antd";

type Props = {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void> | void;
  loading?: boolean;
  submitText?: string;
};

const InvitationForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  loading,
  submitText = "Guardar",
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        estado: "ACTIVO",
        saveTheDate: false,
        invitacionEnviada: false,
        especial: false,
        ...initialValues,
      }}
      onFinish={onSubmit}
    >
      <Form.Item label="Número" name="numero" rules={[{ required: true }]}>
        <Input placeholder="MM001" />
      </Form.Item>

      <Space size="large" wrap>
        <Form.Item label="Hosted By" name="hostedBy">
          <Input placeholder="Novio / Novia / Ambos" />
        </Form.Item>
        <Form.Item label="Tipo" name="tipo">
          <Input placeholder="Familiar / Amigos / ..." />
        </Form.Item>
        <Form.Item label="Familia" name="familia">
          <Input placeholder="Apellido(s) Familia" />
        </Form.Item>
      </Space>

      <Space size="large" wrap>
        <Form.Item
          label="Save the Date"
          name="saveTheDate"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Invitación enviada"
          name="invitacionEnviada"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Especial" name="especial" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Tanteo" name="tanteo">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Estado" name="estado" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "ACTIVO", label: "ACTIVO" },
              { value: "INACTIVO", label: "INACTIVO" },
            ]}
            style={{ minWidth: 160 }}
          />
        </Form.Item>
      </Space>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InvitationForm;
