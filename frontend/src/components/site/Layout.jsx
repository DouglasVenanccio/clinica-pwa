import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}