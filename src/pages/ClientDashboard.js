import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../css/ClientDashboard.css';

const BASE_URL = 'https://jo2024-api.onrender.com';

// frontend/src/pages/ClientDashboard.js

const ClientDashboard = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login', { state: { message: 'Veuillez vous connecter pour accéder à votre tableau de bord.' } });
                return;
            }

            try {
                // Récupérer les informations de l'utilisateur (via le token JWT)
                // Le token contient déjà les infos utilisateur. On peut les décoder côté client
                // ou faire un appel à une route /api/user-info si on veut des infos plus complètes
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    id: decodedToken.id,
                    fullName: decodedToken.full_name,
                    email: decodedToken.email,
                    isAdmin: decodedToken.is_admin
                });

                // Récupérer les commandes de l'utilisateur
                const ordersResponse = await axios.get('${BASE_URL}/api/user/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(ordersResponse.data);

            } catch (err) {
                console.error("Error fetching user data or orders:", err);
                setError("Erreur lors du chargement des données. Veuillez réessayer ou vous reconnecter.");
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token'); // Token expiré ou invalide
                    navigate('/login', { state: { message: 'Votre session a expiré. Veuillez vous reconnecter.' } });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="client-dashboard">
                <header className="client-header">
                    <h1>Chargement du tableau de bord...</h1>
                </header>
            </div>
        );
    }

    if (error) {
        return (
            <div className="client-dashboard">
                <header className="client-header">
                    <h1>Erreur</h1>
                </header>
                <div className="card">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!user) { // Si pas d'utilisateur après le chargement et pas d'erreur spécifique, rediriger.
      return null; // ou un message d'attente/redirection
    }

    return (
        <div className="client-dashboard">
            <header className="client-header">
                <h1>Tableau de bord de {user.fullName}</h1>
            </header>

            <div className="card">
                <h3>Informations personnelles</h3>
                <p><strong>Nom :</strong> {user.fullName}</p>
                <p><strong>E-mail :</strong> {user.email}</p>
                {/* <button className="btn-edit">Modifier</button> */}
            </div>

            <div className="card">
                <h3>Vos Achats</h3>
                {orders.length === 0 ? (
                    <p>Vous n'avez pas encore effectué d'achats.</p>
                ) : (
                    orders.map(order => (
                        <div className="purchase-info" key={order.id}>
                            <div className="qr-code-display">
                                <QRCodeCanvas value={order.qr_code_key} size={100} />
                                <p className="qr-code-label">Clé : {order.qr_code_key}</p> {/* Visible pour le dev/organisation */}
                            </div>
                            <div className="order-details">
                                <p><strong>Date de commande :</strong> {new Date(order.order_date).toLocaleDateString()} à {new Date(order.order_date).toLocaleTimeString()}</p>
                                <p><strong>Total :</strong> {order.total_price.toFixed(2)} €</p>
                                <h4>Articles :</h4>
                                <ul className="order-items-list">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity} x {item.name} ({item.price.toFixed(2)} €/unité)
                                            {item.ticket_count && ` (${item.ticket_count} place${item.ticket_count > 1 ? 's' : ''})`}
                                        </li>
                                    ))}
                                </ul>
                                {/* <button className="btn-show">Détails</button> */}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="card">
                <h3>Paramètres</h3>
                <ul>
                    <li>Gérer les notifications</li>
                    <li>Changer le mot de passe de votre compte</li>
                </ul>
            </div>

            <footer className="client-footer">
                <ul>
                    <li>Conditions Générales</li>
                    <li>Politique de Confidentialité</li>
                    <li>Cookies</li>
                </ul>
            </footer>
        </div>
    );
};

export default ClientDashboard;