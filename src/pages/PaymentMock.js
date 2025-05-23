// frontend/src/pages/PaymentMock.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/PaymentMock.css';

const API = process.env.REACT_APP_BACKEND_URL;

const PaymentMock = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/payment-mock', message: 'Veuillez vous connecter pour finaliser votre commande.' } });
      return;
    }

    const processPayment = async () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (cartItems.length === 0) {
        setPaymentStatus('error');
        setPaymentMessage("Votre panier est vide. Veuillez ajouter des articles avant de procéder à l'achat.");
        setTimeout(() => navigate('/cart'), 2000);
        return;
      }

      try {
        const response = await axios.post(`${API}/api/orders`,
          { cartItems, totalPrice },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setPaymentStatus('success');
          setPaymentMessage(response.data.message || 'Paiement simulé réussi ! Votre commande a été confirmée.');
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('storage'));

          navigate('/dashboard', { state: { orderId: response.data.orderId, qrCodeKey: response.data.qrCodeKey } });

        } else {
          setPaymentStatus('error');
          setPaymentMessage(response.data.message || 'Paiement simulé échoué. Veuillez réessayer.');
        }
      } catch (err) {
        setError(err);
        setPaymentStatus('error');
        if (err.response && err.response.status === 401) {
            setPaymentMessage('Votre session a expiré. Veuillez vous reconnecter.');
            setTimeout(() => navigate('/login', { state: { from: '/payment-mock' } }), 2000);
        } else if (err.response && err.response.data && err.response.data.message) {
            setPaymentMessage(`Une erreur est survenue : ${err.response.data.message}`);
        }
        else {
            setPaymentMessage('Une erreur est survenue lors du traitement du paiement.');
        }
        console.error('Erreur de paiement:', err);
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div className="payment-mock-page">
      <header className="payment-mock-header">
        <h1>Page de Paiement (Simulé)</h1>
        <p>Veuillez patienter pendant le traitement de votre paiement.</p>
      </header>

      <section className="payment-status-section">
        {paymentStatus === 'processing' && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <p>Traitement de votre paiement...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="payment-success">
            <h2>🎉 Succès !</h2>
            <p>{paymentMessage}</p>
            <p>Redirection vers votre tableau de bord...</p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="payment-error">
            <h2>❌ Échec du paiement</h2>
            <p>{paymentMessage}</p>
            {error && error.response && error.response.data && (
                <p>Détails : {error.response.data.message}</p>
            )}
            <button onClick={() => navigate('/cart')} className="btn-payment-retry">Retourner au panier</button>
            <Link to="/offers" className="btn-payment-return">Retourner aux offres</Link>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default PaymentMock;