import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ConfigProvider } from '@/lib/ConfigContext';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import FinanceiroAdmin from '@/pages/admin/Financeiro';
import ConfiguracoesAdmin from '@/pages/admin/Configuracoes';
import UsersAdmin from '@/pages/admin/UsersAdmin';
import Avaliacao from '@/pages/Avaliacao';
import Fidelidade from '@/pages/Fidelidade';
import MeusAgendamentos from '@/pages/MeusAgendamentos';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/agendamento" element={<ProtectedRoute><Agendamento /></ProtectedRoute>} />
                <Route path="/avaliacao" element={<ProtectedRoute><Avaliacao /></ProtectedRoute>} />
                <Route path="/fidelidade" element={<ProtectedRoute><Fidelidade /></ProtectedRoute>} />
                <Route path="/meus-agendamentos" element={<ProtectedRoute><MeusAgendamentos /></ProtectedRoute>} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/redefinir-senha" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN", "PROFISSIONAL"]}><Admin /></ProtectedRoute>} />
              <Route path="/dashboard/agendamentos" element={<ProtectedRoute allowedRoles={["ADMIN", "PROFISSIONAL"]}><Appointments /></ProtectedRoute>} />
              <Route path="/dashboard/servicos" element={<ProtectedRoute allowedRoles={["ADMIN"]}><ServicesAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/profissionais" element={<ProtectedRoute allowedRoles={["ADMIN"]}><ProfessionalsAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/analise" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AnalyticsAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/disponibilidade" element={<ProtectedRoute allowedRoles={["ADMIN", "PROFISSIONAL"]}><AvailabilityAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/financeiro" element={<ProtectedRoute allowedRoles={["ADMIN"]}><FinanceiroAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/configuracoes" element={<ProtectedRoute allowedRoles={["ADMIN"]}><ConfiguracoesAdmin /></ProtectedRoute>} />
              <Route path="/dashboard/usuarios" element={<ProtectedRoute allowedRoles={["ADMIN"]}><UsersAdmin /></ProtectedRoute>} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </ConfigProvider>
    </AuthProvider>
  )
}

export default App;
