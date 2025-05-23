// frontend/src/components/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Assurez-vous que ce chemin est correct

const Header = () => {
  // Chemins vers les images dans le dossier public
  const images = [
    "/images/jo-athletes.jpg",
    "/images/stade-jo.jpg",
    "/images/flamme-jo.jpg",
    "/images/cyclisme.jpg",
    "/images/natation.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false); // État pour le menu hamburger

  // Utilisation de 'user' comme objet directement pour stocker les infos de l'utilisateur
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Effet pour le carrousel d'images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % images.length
      );
    }, 5000); // Change l'image toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [images.length]);

  // Effet pour récupérer les infos utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // C'EST CE QUE Header.js recherche
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de parsing de l'utilisateur depuis localStorage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    // Gérer les mises à jour de localStorage pour le panier et l'état utilisateur
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange); // Écoute l'événement personnalisé

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };

  }, []); // Exécuter une seule fois au montage du composant et écouter les changements

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Supprimer les infos utilisateur
    localStorage.removeItem('cart'); // Vider aussi le panier à la déconnexion
    localStorage.removeItem('adminAuthCode'); // Supprimer le code d'accès admin
    setUser(null); // Réinitialiser l'état de l'utilisateur
    setIsNavOpen(false); // Fermer le menu si ouvert
    window.dispatchEvent(new Event('authChange')); // Déclenche un événement personnalisé
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <header className="hero-header">
      <nav className="nav">
        <h1 className="logo">🏅 Paris 2024</h1> {/* Ton logo avec médaille */}

        {/* Hamburger Menu pour mobile */}
        <div className={`hamburger-menu ${isNavOpen ? 'open' : ''}`} onClick={toggleNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Liens de navigation */}
        <ul className={`nav-links ${isNavOpen ? 'open' : ''}`}>
          <li><Link to="/home" onClick={() => setIsNavOpen(false)}>Accueil</Link></li>
          <li><Link to="/offers" onClick={() => setIsNavOpen(false)}>Offres</Link></li>
          <li><Link to="/contact" onClick={() => setIsNavOpen(false)}>Contact</Link></li>
          <li><Link to="/cart" onClick={() => setIsNavOpen(false)}>Panier</Link></li> {/* Lien vers le panier */}

          {/* LOGIQUE D'AFFICHAGE CONDITIONNEL POUR LA CONNEXION/DÉCONNEXION */}
          {user ? (
            <>
              {/* Le lien "Mon Espace" ou "Admin" affiche aussi le "Salut, [Nom] !" */}
              {user.is_admin ? (
                <li>
                  <Link to="/admin-auth" className="btn-nav" onClick={() => setIsNavOpen(false)}>
                    Salut, {user.full_name ? user.full_name.split(' ')[0] : user.email} ! (Admin)
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/clientDashboard" className="btn-nav" onClick={() => setIsNavOpen(false)}>
                    Salut, {user.full_name ? user.full_name.split(' ')[0] : user.email} ! (Mon Espace)
                  </Link>
                </li>
              )}
              <li><button onClick={handleLogout} className="btn-nav logout-button">Déconnexion</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn-nav" onClick={() => setIsNavOpen(false)}>Connexion</Link></li>
              <li><Link to="/register" className="btn-nav" onClick={() => setIsNavOpen(false)}>Inscription</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/* Section Hero avec le carrousel d'images */}
      <div
        className="hero-content"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Bienvenue aux Jeux Olympiques de Paris 2024</h1>
            <p>Vivez une expérience unique au cœur de l'événement mondial.</p>
            <div className="hero-actions">
              <Link to="/offers" className="btn-primary">Voir les offres</Link>
              <Link to="/register" className="btn-outline">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;