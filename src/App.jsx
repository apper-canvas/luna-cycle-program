import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';
import { userSettingsService } from './services';

function App() {
  useEffect(() => {
    // Apply saved theme on app load
    const loadTheme = async () => {
      try {
        const settings = await userSettingsService.get();
        const themeName = settings.theme || 'purple';
        
        const themeColors = {
          purple: { primary: '#9C6FDE', secondary: '#F5A5C8', accent: '#6B46C1' },
          pink: { primary: '#E91E63', secondary: '#F8BBD9', accent: '#C2185B' },
          green: { primary: '#4CAF50', secondary: '#A5D6A7', accent: '#388E3C' },
          blue: { primary: '#2196F3', secondary: '#90CAF9', accent: '#1976D2' }
        };
        
        const colors = themeColors[themeName] || themeColors.purple;
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-secondary', colors.secondary);
        root.style.setProperty('--theme-accent', colors.accent);
      } catch (error) {
        console.warn('Failed to load theme settings:', error);
      }
    };
    
    loadTheme();
  }, []);
  return (
    <div className="desktop-layout">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/calendar" replace />} />
          {routeArray.map(route => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
</Route>
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-lg"
          bodyClassName="text-sm font-body"
          progressClassName="bg-primary"
          style={{ zIndex: 9999 }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;