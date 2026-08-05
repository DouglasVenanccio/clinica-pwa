import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
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
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/avaliacao" element={<Avaliacao />} />
              <Route path="/fidelidade" element={<Fidelidade />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/agendamentos" element={<Appointments />} />
            <Route path="/admin/servicos" element={<ServicesAdmin />} />
            <Route path="/admin/profissionais" element={<ProfessionalsAdmin />} />
            <Route path="/admin/analise" element={<AnalyticsAdmin />} />
            <Route path="/admin/disponibilidade" element={<AvailabilityAdmin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App;
