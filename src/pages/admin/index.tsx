import dynamic from "next/dynamic";
import LoginGate from "@/components/admin/LoginGate";
import LoginForm from "@/components/admin/LoginForm";

// Importa tu lista con SSR desactivado (por temas de hooks de sesión)
const AdminList = dynamic(() => import("@/components/admin/AdminList"), {
  ssr: false,
});

export default function AdminPage() {
  return (
    <LoginGate LoginForm={LoginForm}>
      <AdminList />
    </LoginGate>
  );
}
