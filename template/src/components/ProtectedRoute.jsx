import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ShieldAlert } from 'lucide-react';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const ROLE_LABELS = { admin: 'administrador', colaborador: 'colaborador', user: 'cliente' };

const AccessDenied = ({ userRole, requiredRoles }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6">
    <div className="max-w-md text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
        <ShieldAlert size={32} className="text-red-500" />
      </div>
      <h1 className="font-display font-bold text-2xl text-[#2b2622]">Acesso restrito</h1>
      <p className="text-[#2b2622]/60 mt-2">
        Esta área é exclusiva para{' '}
        <strong>{requiredRoles.map((r) => ROLE_LABELS[r] || r).join(' ou ')}</strong>.
        Seu perfil atual é <strong>{ROLE_LABELS[userRole] || userRole}</strong>.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-full text-sm font-medium transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  </div>
);

export default function ProtectedRoute({
  fallback = <DefaultFallback />,
  unauthenticatedElement,
  requiredRoles,
}) {
  const { user, isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <AccessDenied userRole={user.role} requiredRoles={requiredRoles} />;
  }

  return <Outlet />;
}