// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Offers from './pages/Offers';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import PaymentMock from './pages/PaymentMock';
import Home from './pages/Home'; // Assurez-vous que le chemin est correct
import ClientDashboard from './pages/ClientDashboard'; // <-- Importez le nouveau composant

import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Offers />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/home" element={<Home />} />
          <Route path="/payment-mock" element={<PaymentMock />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<ClientDashboard />} /> {/* <-- Ajoutez la nouvelle route */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;