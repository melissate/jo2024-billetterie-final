// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      setMessageType('error');
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!email || !password) {
      setMessage('Veuillez remplir tous les champs.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      // --- C'EST ICI LA MODIFICATION CRUCIALE ---
      localStorage.setItem('token', response.data.token);
      // Stocke l'objet user complet, qui contient full_name et is_admin
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // --- FIN DE LA MODIFICATION ---

      setMessage('Connexion réussie !');
      setMessageType('success');
      // Déclencher un événement pour que le Header et d'autres composants se mettent à jour
      window.dispatchEvent(new Event('authChange'));

      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        // Tu peux choisir de rediriger vers le tableau de bord client par défaut
        // Ou vers la page des offres
        navigate('/dashboard'); // Redirige les utilisateurs normaux vers leur tableau de bord par défaut
      }
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
      setMessageType('error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Se connecter</h2>
        {message && (
          <div className={`auth-message ${messageType === 'success' ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Se connecter</button>
        </form>
        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;