import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function PageLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />
      <div className={`main-area ${mobileMenuOpen ? 'sidebar-pushed' : ''}`}>
        <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="page-content">
          {children}
        </main>
      </div>
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
    </div>
  );
}

export default PageLayout;