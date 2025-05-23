// frontend/src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import '../css/Cart.css';
import { Link, useNavigate } from 'react-router-dom'; // Importez useNavigate

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Hook pour la navigation
  const [authMessage, setAuthMessage] = useState(''); // Message pour l'authentification

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const newTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(newTotalPrice);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTicketCountIcon = (count) => {
    if (count === 1) return '👤';
    if (count === 2) return '🤝';
    if (count >= 3) return '👨‍👩‍👧‍👦';
    return '🎟️';
  };

  // NOUVELLE FONCTION POUR GÉRER LE CHECKOUT
  const handleCheckout = () => {
    const token = localStorage.getItem('token'); // Vérifie si l'utilisateur est connecté

    if (!token) {
      // Si pas connecté, rediriger vers la page de connexion avec un message
      setAuthMessage('Vous devez vous connecter pour procéder à l\'achat.');
      setTimeout(() => {
        navigate('/login', { state: { from: '/cart', message: 'Veuillez vous connecter pour finaliser votre commande.' } });
      }, 1500); // Laisse un peu de temps pour lire le message avant redirection
    } else if (cartItems.length === 0) {
        setAuthMessage('Votre panier est vide. Veuillez ajouter des articles avant de procéder à l\'achat.');
        setTimeout(() => setAuthMessage(''), 3000); // Message disparaît après 3s
    } else {
      // Si connecté, rediriger vers la page de paiement simulée
      navigate('/payment-mock');
    }
  };


  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Votre Panier</h1>
        <p>Revoyez les offres sélectionnées avant de finaliser votre commande.</p>
      </header>

      {authMessage && (
        <div className="auth-notification error">
          {authMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty-message">
          <p>Votre panier est vide pour le moment.</p>
          <Link to="/offers" className="btn-return-offers">
            Retourner aux offres
          </Link>
        </div>
      ) : (
        <section className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div className="cart-item-card" key={item.id}>
                <img src={item.image_url || '/images/default-offer.jpg'} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <p className="cart-item-price">{item.price.toFixed(2)} € / billet</p>
                  {item.ticket_count && item.ticket_count > 0 && (
                      <p className="cart-item-ticket-count">
                          {getTicketCountIcon(item.ticket_count)} {item.ticket_count} place{item.ticket_count > 1 ? 's' : ''}
                      </p>
                  )}
                  <div className="cart-item-quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)} className="quantity-btn">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} className="quantity-btn">+</button>
                    <button onClick={() => removeItem(item.id)} className="remove-item-btn">Supprimer</button>
                  </div>
                  <p className="cart-item-subtotal">Sous-total : {(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Récapitulatif de la commande</h2>
            <div className="summary-line">
              <span>Nombre d'articles :</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-line total-price">
              <span>Prix Total :</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            {/* Le bouton Procéder à l'achat appelle maintenant handleCheckout */}
            <button className="btn-checkout" onClick={handleCheckout}>Procéder à l'achat</button>
            <button onClick={clearCart} className="btn-clear-cart">Vider le panier</button>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Cart;