import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const currentRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-full overflow-hidden">
      {/* Header with gradient background */}
      <header className="flex-shrink-0 bg-gradient-primary text-white px-6 py-6 pb-8">
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
      
      {/* Main content area */}
      <main className="flex-1 bg-white relative -mt-4 rounded-t-3xl min-h-0">
        <div className="h-full overflow-y-auto pb-24">
          <div className="max-w-sm mx-auto px-6 py-6">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;