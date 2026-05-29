import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Suspense } from 'react';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ErrorBoundary';
import { AlertTriangle } from 'lucide-react';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Technologies = React.lazy(() => import('./pages/Technologies'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Store = React.lazy(() => import('./pages/Store'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Quote = React.lazy(() => import('./pages/Quote'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
import { Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// ScrollToTop component to ensure navigation resets scroll
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// ProtectedRoute component to shield admin areas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-nxr-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-nxr-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<ErrorBoundary key="home" routeName="Início"><Home /></ErrorBoundary>} />
            <Route path="/about" element={<ErrorBoundary key="about" routeName="Sobre Nós"><About /></ErrorBoundary>} />
            <Route path="/services" element={<ErrorBoundary key="services" routeName="Serviços"><Services /></ErrorBoundary>} />
            <Route path="/store" element={<ErrorBoundary key="store" routeName="Loja"><Store /></ErrorBoundary>} />
            <Route path="/technologies" element={<ErrorBoundary key="technologies" routeName="Tecnologias"><Technologies /></ErrorBoundary>} />
            <Route path="/quote" element={<ErrorBoundary key="quote" routeName="Orçamento"><Quote /></ErrorBoundary>} />
            <Route path="/blog" element={<ErrorBoundary key="blog" routeName="Blog"><Blog /></ErrorBoundary>} />
            <Route path="/blog/:slug" element={<ErrorBoundary key="blog-post" routeName="Artigo"><BlogPost /></ErrorBoundary>} />
            <Route path="/contact" element={<ErrorBoundary key="contact" routeName="Contacto"><Contact /></ErrorBoundary>} />
            <Route path="/privacy" element={<ErrorBoundary key="privacy" routeName="Política de Privacidade"><Privacy /></ErrorBoundary>} />
            <Route path="/admin/login" element={<ErrorBoundary key="adminlogin" routeName="Login"><AdminLogin /></ErrorBoundary>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <ErrorBoundary key="admin" routeName="Painel de Administração" isAdmin={true}>
                    <Admin />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorBoundary key="notfound" routeName="Não Encontrado"><NotFound /></ErrorBoundary>} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;