'use client';

import React, { useState } from 'react';
import { Button, List, Typography } from 'antd';

export default function ListaInvitaciones() {
  const [urls, setUrls] = useState<string[]>([]);

  const obtenerLista = async () => {
    try {
      const res = await fetch('/api/invitaciones/lista');
      if (res.ok) {
        const json = await res.json();
        setUrls(json.urls);
      } else {
        console.error('Error al obtener URLs:', res.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Button type="primary" onClick={obtenerLista}>
        Obtener URLs codificadas
      </Button>
      {urls.length > 0 && (
        <List
          header={<Typography.Title level={4}>URLs de Invitación</Typography.Title>}
          bordered
          dataSource={urls}
          renderItem={(url) => (
            <List.Item>
              <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            </List.Item>
          )}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
}
