import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const currentRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row max-w-full overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex desktop-sidebar bg-gradient-primary text-white flex-col">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary text-xs font-bold">🌙</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">Luna Cycle</h1>
              <p className="text-purple-100 text-xs font-body">
                Your cycle companion
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {routeArray.map(route => (
              <a
                key={route.id}
                href={route.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors
                  ${location.pathname === route.path 
                    ? 'bg-white/20 text-white' 
                    : 'text-purple-100 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{route.icon}</span>
                <span>{route.label}</span>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex-shrink-0 bg-gradient-primary text-white px-6 py-6 pb-8">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold">Luna Cycle</h1>
                <p className="text-purple-100 text-sm font-body mt-1">
                  Your personal cycle companion
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">🌙</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Desktop Header */}
        <header className="hidden md:block flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {currentRoute?.label || 'Luna Cycle'}
              </h2>
              <p className="text-gray-600 text-sm font-body mt-1">
                Track your cycle with confidence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🌙</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 bg-white relative md:relative md:mt-0 -mt-4 rounded-t-3xl md:rounded-none min-h-0">
          <div className="h-full overflow-y-auto pb-24 md:pb-8">
            <div className="max-w-sm md:max-w-none mx-auto px-6 md:px-8 py-6 md:py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;