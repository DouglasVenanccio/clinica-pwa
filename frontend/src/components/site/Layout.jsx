import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import MobileNav from './MobileNav';
import InstallPrompt from './InstallPrompt';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileNav />
      <InstallPrompt />
    </div>
  );
}