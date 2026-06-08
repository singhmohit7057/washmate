import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { COLORS } from '../../lib/constants';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.background }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '68px' }} id="main-content">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
