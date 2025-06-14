import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';

function App() {
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