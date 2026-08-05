import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}