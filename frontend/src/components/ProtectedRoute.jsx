import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Componente de rota protegida com suporte a roles.
 *
 * Props:
 *  - children: conteudo da rota
 *  - allowedRoles: array de roles permitidos (ex: ["ADMIN", "PROFISSIONAL"])
 *                   Se omitido, qualquer usuario logado pode acessar.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const location = useLocation();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN" || user.role === "PROFISSIONAL") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/agendamento" replace />;
  }

  return children;
}
