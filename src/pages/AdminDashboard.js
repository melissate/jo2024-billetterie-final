import React, { useEffect, useState } from 'react';
import '../css/AdminDashboard.css';
import { Link, useNavigate } from 'react-router-dom';


import axios from 'axios';
const API = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState({});
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorSales, setErrorSales] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: 'Veuillez vous connecter pour accéder au tableau de bord admin.' } });
      return;
    }

    // Vérifier si l'utilisateur est admin en décodant le token
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      if (!decoded.is_admin) {
        navigate('/login', { state: { message: 'Accès non autorisé. Réservé aux administrateurs.' } });
        return;
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      navigate('/login', { state: { message: 'Token invalide. Veuillez vous reconnecter.' } });
      return;
    }

    const fetchSalesData = async () => {
      try {
        const response = await axios.get('${API}/api/admin/sales-report', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSalesData(response.data);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setErrorSales("Erreur lors du chargement des données de ventes.");
        if (err.response && err.response.status === 401) {
            navigate('/login', { state: { message: 'Session expirée. Veuillez vous reconnecter.' } });
        } else if (err.response && err.response.status === 403) {
            navigate('/login', { state: { message: 'Accès non autorisé. Réservé aux administrateurs.' } });
        }
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSalesData();
  }, [navigate]);


  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Espace de gestion du compte</h1>
        <p>Bienvenue sur votre tableau de bord de gestion</p>
      </header>

      <main className="admin-content">
        <div className="card">
          <h2>Nombre de ventes</h2>
          {loadingSales ? (
            <p>Chargement des données de ventes...</p>
          ) : errorSales ? (
            <p className="error-message">{errorSales}</p>
          ) : (
            <ul>
              {Object.keys(salesData).length === 0 ? (
                <li>Aucune vente enregistrée pour le moment.</li>
              ) : (
                Object.entries(salesData).map(([offerTitle, quantity]) => (
                  <li key={offerTitle}>{offerTitle}: {quantity} billet(s) vendu(s)</li>
                ))
              )}
            </ul>
          )}
          {/* <Link to="/admin/ventes">→</Link> */} {/* Pas de page /admin/ventes séparée pour l'instant, c'est ici */}
        </div>

        <div className="card">
          <h2>Gestion des offres</h2>
          <p>Ajoutez, visualisez ou modifiez les offres de billets.</p>
          <Link to="/admin/offers">→</Link> {/* Link to the new AdminOffers page */}
        </div>

        <div className="card">
          <h2>Gestion des utilisateurs</h2>
          <p>Gérez les utilisateurs et leurs informations de compte</p>
          <Link to="/admin/users">→</Link> {/* Link to the new AdminUsers page */}
        </div>
      </main>

      <footer className="admin-footer">
        <div>Column One</div>
        <div>Useful Links</div>
        <div>Legal</div>
        <div>Social Media</div>
      </footer>
    </div>
  );
};

export default AdminDashboard;