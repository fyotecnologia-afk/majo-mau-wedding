// src/components/admin/AdminLayout.tsx
import React, { ReactNode, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Space } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.reload();
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <TeamOutlined />,
      label: "Invitados",
    },
    {
      key: "/admin/lista",
      icon: <FileTextOutlined />,
      label: "Lista Invitaciones",
    },
    {
      key: "configuracion",
      icon: <SettingOutlined />,
      label: "Configuración",
      children: [
        { key: "/admin/config/perfil", label: "Perfil" },
        { key: "/admin/config/ajustes", label: "Ajustes" },
      ],
    },
  ];

  const dropdownMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            paddingLeft: collapsed ? 0 : 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {!collapsed && "Admin Panel"}
        </div>

        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <Avatar size={64} icon={<UserOutlined />} />
          {!collapsed && (
            <div style={{ color: "#fff", marginTop: 8 }}>Administrador</div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          onClick={({ key }) => {
            if (!key.startsWith("config")) router.push(key);
          }}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {router.pathname === "/admin" && "Invitados"}
            {router.pathname === "/admin/lista" && "Lista de Invitaciones"}
          </h2>
          <Dropdown menu={{ items: dropdownMenuItems }}>
            <Button type="text">
              <Space>
                <Avatar icon={<UserOutlined />} size="small" />
                Admin
              </Space>
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 16,
            background: "#fff",
            minHeight: 360,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
