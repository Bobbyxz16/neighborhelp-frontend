import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract current page from pathname
  const getCurrentPage = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    return path || 'home'; // Default to 'home' if empty
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;