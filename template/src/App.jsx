import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/site/Layout';
import Home from '@/pages/Home';
import Agendamento from '@/pages/Agendamento';
import Admin from '@/pages/Admin';
import Appointments from '@/pages/admin/Appointments';
import ServicesAdmin from '@/pages/admin/Services';
import ProfessionalsAdmin from '@/pages/admin/Professionals';
import AnalyticsAdmin from '@/pages/admin/Analytics';
import AvailabilityAdmin from '@/pages/admin/Availability';
import Avaliacao from '@/pages/Avaliacao';
import Fidelidade from '@/pages/Fidelidade';
import MeusAgendamentos from '@/pages/MeusAgendamentos';
import MinhaConta from '@/pages/MinhaConta';
import PainelColaborador from '@/pages/PainelColaborador';
import UsersAdmin from '@/pages/admin/Users';
import ConfiguracoesAdmin from '@/pages/admin/Configuracoes';
import ProtectedRoute from '@/components/ProtectedRoute';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/avaliacao" element={<Avaliacao />} />
        <Route path="/fidelidade" element={<Fidelidade />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
        </Route>
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} requiredRoles={['colaborador', 'admin']} />}>
          <Route path="/painel" element={<PainelColaborador />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} requiredRoles={['admin']} />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/agendamentos" element={<Appointments />} />
        <Route path="/admin/servicos" element={<ServicesAdmin />} />
        <Route path="/admin/profissionais" element={<ProfessionalsAdmin />} />
        <Route path="/admin/analise" element={<AnalyticsAdmin />} />
        <Route path="/admin/disponibilidade" element={<AvailabilityAdmin />} />
        <Route path="/admin/usuarios" element={<UsersAdmin />} />
        <Route path="/admin/configuracoes" element={<ConfiguracoesAdmin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App