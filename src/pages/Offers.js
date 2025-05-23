
import React, { useEffect, useState } from 'react';
import '../css/Offers.css';
import { Link } from 'react-router-dom'; // Assurez-vous que Link est bien importé

import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;



const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [cartMessage, setCartMessage] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AVANT: fetch('${API}/api/offers')
    // APRÈS:
    fetch(`${API}/api/offers`) // <-- Changer les ' en `
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const adaptedOffers = data.map(offer => ({
            ...offer,
            name: offer.title
        }));
        setOffers(adaptedOffers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching offers:", err);
        setError("Erreur lors du chargement des offres. Veuillez réessayer plus tard.");
        setLoading(false);
      });
  }, []);

  // Fonction pour ajouter un article au panier
  const addToCart = (offer) => {
    if (typeof offer.price !== 'number' || isNaN(offer.price)) {
      setCartMessage({ show: true, message: `Impossible d'ajouter "${offer.name}" au panier. Prix invalide.`, type: 'error' });
      // Laissez le message d'erreur disparaître après 3 secondes
      setTimeout(() => setCartMessage({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === offer.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: offer.id,
        name: offer.name,
        title: offer.name,
        price: offer.price,
        image_url: offer.image_url,
        quantity: 1,
        ticket_count: offer.ticket_count
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // --- MODIFICATION ICI ---
    setCartMessage({
      show: true,
      message: `${offer.name} a été ajouté au panier !`,
      type: 'success',
      // Ajouter un indicateur pour garder le message visible (pas de timeout automatique)
      // Ou une durée plus longue si vous voulez qu'il disparaisse quand même
      // Pour le garder visible jusqu'à ce que l'utilisateur clique ou change de page, supprimez le setTimeout ici
    });
    // Si vous voulez qu'il reste indéfiniment jusqu'à un clic ou navigation, ne pas mettre de setTimeout ici.
    // Si vous voulez une durée plus longue (ex: 10 secondes), mettez:
    // setTimeout(() => setCartMessage({ show: false, message: '', type: '' }), 10000);
  };

  // Fonction pour déterminer l'icône basée sur offer.name ou offer.category
  const getOfferIcon = (offer) => {
    const nameLower = offer.name.toLowerCase();
    const categoryLower = offer.category ? offer.category.toLowerCase() : '';

    if (nameLower.includes('solo')) {
      return '👤';
    }
    if (nameLower.includes('duo')) {
      return '🤝';
    }
    if (nameLower.includes('familiale')) {
      return '👨‍👩‍👧‍👦';
    }
    if (categoryLower.includes('cérémonie')) {
        return '🎉';
    }
    if (nameLower.includes('athlétisme')) {
        return '🏅';
    }
    if (nameLower.includes('natation')) {
        return '🏊';
    }
    if (categoryLower.includes('sport') || nameLower.includes('escrime')) {
        return '🏅';
    }
    if (categoryLower.includes('expérience') || nameLower.includes('village olympique')) {
        return '✨';
    }
    if (nameLower.includes('package')) {
        return '📦';
    }
    return '🎟️';
  };

  // Function to determine highlight text
  const getHighlightText = (offer) => {
    if (offer.description && offer.description.toLowerCase().includes('choix populaire')) {
      return 'Choix Populaire';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="offers-page">
        <header className="offers-header">
          <h1>Chargement des offres...</h1>
          <p>Veuillez patienter.</p>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-page">
        <header className="offers-header">
          <h1>Erreur de chargement</h1>
          <p>{error}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <header className="offers-header">
        <h1>Découvrez Nos Offres de Billets</h1>
        <p>Choisissez une offre pour une expérience unique aux Jeux Olympiques 2024 en France, sécurisée et scannée à l’entrée. Vivez l'émotion du sport en direct !</p>
      </header>

      {/* --- MODIFICATION ICI : Affichage du message avec lien vers le panier --- */}
      {cartMessage.show && (
        <div className={`cart-notification ${cartMessage.type}`}>
          {cartMessage.message}
          {/* Affiche le bouton "Voir le panier" uniquement si le message est de type 'success' */}
          {cartMessage.type === 'success' && (
            <Link to="/cart" className="view-cart-btn">
              Voir le panier
            </Link>
          )}
          {/* Bouton pour fermer le message (optionnel, mais recommandé si le message ne disparaît pas automatiquement) */}
          <button className="close-notification-btn" onClick={() => setCartMessage({ show: false, message: '', type: '' })}>
            &times;
          </button>
        </div>
      )}

      <section className="offers-container">
        {offers.map((offer) => (
          <div className={`offer-card ${getHighlightText(offer) ? 'highlight' : ''}`} key={offer.id}>
            {getHighlightText(offer) && <span className="highlight-tag">{getHighlightText(offer)}</span>}
            <div className="offer-icon-wrapper">
              <span className="offer-card-icon">{getOfferIcon(offer)}</span>
            </div>
            <h2>{offer.name}</h2>
            {offer.ticket_count > 0 && (
                <p className="offer-details">{offer.ticket_count} place{offer.ticket_count > 1 ? 's' : ''}</p>
            )}
            <p className="offer-description">{offer.description}</p>
            <button onClick={() => addToCart(offer)} className="btn-reserver">
                Réserver Votre Billet ({offer.price.toFixed(2)} €)
            </button>
          </div>
        ))}
      </section>

      <section className="offers-footer-section">
        <h2>Optimisez votre expérience des JO</h2>
        <p>Chaque billet est conçu pour répondre à vos besoins spécifiques. Profitez de la flexibilité et de la sécurité.</p>
        <div className="features-grid">
            <div className="feature-item">
                <h3>Accès Prioritaire</h3>
                <p>Évitez les files d'attente avec nos billets premium.</p>
            </div>
            <div className="feature-item">
                <h3>Support 24/7</h3>
                <p>Notre équipe est là pour vous accompagner à tout moment.</p>
            </div>
            <div className="feature-item">
                <h3>Options Flexibles</h3>
                <p>Modifiez vos dates ou événements selon vos envies.</p>
            </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Offers;