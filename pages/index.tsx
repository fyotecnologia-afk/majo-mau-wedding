// pages/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Typography, Alert, Space } from 'antd';

const { Title } = Typography;

export default function Home() {
  const [numero, setNumero] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const trimmed = numero.trim();
    if (!trimmed) {
      setError('Ingresa tu número de invitación');
      return;
    }
    setError('');
    const encoded = btoa(trimmed);
    router.push(`/${encoded}`);
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center', padding: 16 }}>
      <Title level={3}>Ingresa tu número de invitación</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ej. 1234ABCD"
        />
        <Button type="primary" onClick={handleSubmit} block>
          Ver invitación
        </Button>
        {error && <Alert message={error} type="error" showIcon />}
      </Space>
    </div>
  );
}
