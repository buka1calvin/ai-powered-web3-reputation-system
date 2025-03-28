import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import routes from './Routes';

import PublicRoute from './guard/PublicRoute';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './appUi/components/ui/ScrollToTop';
import { RouteChild, RouteConfig } from './types/routes/ route';
import ProtectedRoute from './guard/protecteRoutes';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <main className="overflow-x-hidden">
          <Routes>
            {routes.map((route: RouteConfig, index: number) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute allowedRoles={route.allowedRoles}>
                      <route.element />
                    </ProtectedRoute>
                  ) : (
                    <PublicRoute>
                      <route.element />
                    </PublicRoute>
                  )
                }
              >
                {route.children &&
                  route.children.map((childRoute: RouteChild, childIndex: number) => (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={
                        childRoute.protected ? (
                          <ProtectedRoute allowedRoles={childRoute.allowedRoles}>
                            <childRoute.element />
                          </ProtectedRoute>
                        ) : (
                          <PublicRoute>
                            <childRoute.element />
                          </PublicRoute>
                        )
                      }
                    />
                  ))}
              </Route>
            ))}
          </Routes>
          <Toaster />
          <ScrollToTop />
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;