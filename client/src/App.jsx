import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              }
            />

            {/* Customer Routes (With Navbar/Footer) */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen font-sans flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<ProductListing />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Login />} />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
