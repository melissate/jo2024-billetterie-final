// src/pages/Register.js (ou où votre fichier Register.js est stocké)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Register.css'; // Assurez-vous que ce fichier CSS existe et est correct
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle, FaPhone, FaShieldAlt } from 'react-icons/fa';

// AJOUTE CETTE LIGNE ICI :
const API = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState(''); // Pour les messages de succès/erreur de l'API
    const [isLoading, setIsLoading] = useState(false); // Pour gérer l'état de chargement du bouton

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setRegistrationMessage('');
        setPasswordMatchError(false);
      
        if (form.password !== form.confirmPassword) {
          setPasswordMatchError(true);
          setRegistrationMessage('❌ Les mots de passe ne correspondent pas.');
          return;
        }
      
        setIsLoading(true);
      
        try {
            // AVANT: const response = await axios.post('${API}/api/register', {
            // APRÈS:
            const response = await axios.post(`${API}/api/register`, { // <-- Changer les ' en `
              full_name: form.full_name,
              email: form.email,
              password: form.password
            });
      
          setRegistrationMessage('✅ ' + (response.data.message || 'Compte créé avec succès !'));
          console.log(response.data);
      
          // Réinitialiser le formulaire après succès
          setForm({ full_name: '', email: '', password: '', confirmPassword: '' });
      
          // Redirection vers la page de login après un court délai
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Redirige après 2 secondes
      
        } catch (err) {
          console.error('Erreur d\'inscription:', err.response ? err.response.data : err);
          setRegistrationMessage('❌ ' + (
            err.response?.data?.message || 'Une erreur est survenue lors de la création du compte.'
          ));
        } finally {
          setIsLoading(false); // Arrête le chargement, que ce soit un succès ou une erreur
        }
      };
      
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      
        // Réinitialiser les messages d'erreur si l'utilisateur modifie les champs
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
          setPasswordMatchError(false);
        }
        setRegistrationMessage(''); // Efface les messages précédents lors de la saisie
    };

    return (
        <div className="register-page">
            <header className="register-header">
                <h1>Créez votre compte pour les JO Paris 2024</h1>
                <p>Inscrivez-vous pour accéder à la billetterie officielle et réserver vos places.</p>
            </header>

            <main className="register-content-wrapper">
                <section className="register-form-section">
                    <div className="register-form">
                        <h2>Création de compte</h2>
                        <form onSubmit={handleSubmit}>
                            {registrationMessage && (
                                <p className={`form-message ${registrationMessage.startsWith('✅') ? 'success-message' : 'error-message'}`}>
                                    {registrationMessage.startsWith('✅') ? <FaCheckCircle className="message-icon" /> : <FaExclamationCircle className="message-icon" />}
                                    {registrationMessage}
                                </p>
                            )}

                            <div className="form-group">
                                <label htmlFor="full_name">Nom Complet</label>
                                <div className="input-with-icon">
                                    
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        placeholder="jean"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        required // Rendre le champ obligatoire
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Adresse E-mail</label>
                                <div className="input-with-icon">
                                    
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="votre.email@exemple.com"
                                        value={form.email}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mot de passe</label>
                                <div className="input-with-icon">
                                    
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Minimum 8 caractères"
                                        value={form.password}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                                <div className="input-with-icon">
                                    
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirmez votre mot de passe"
                                        value={form.confirmPassword}
                                        required
                                        onChange={handleChange}
                                        className={passwordMatchError ? 'input-error' : ''}
                                    />
                                </div>
                                {passwordMatchError && (
                                    <p className="error-message">
                                        <FaExclamationCircle className="error-icon" /> Les mots de passe ne correspondent pas.
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                            </button>
                        </form>

                        <p className="already-account">
                            Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
                        </p>
                    </div>
                </section>

                <section className="register-support">
                    <div className="support-card">
                        <h3><FaShieldAlt className="support-card-icon" /> Besoin d’assistance ?</h3>
                        <p>Nous sommes là pour vous aider en cas de problème lors de la création de votre compte ou pour toute question.</p>
                        <div className="support-contacts">
                            <p>
                                <FaEnvelope className="support-icon" /> Email : <a href="mailto:support@jo2024.fr">support@jo2024.fr</a>
                            </p>
                            <p>
                                <FaPhone className="support-icon" /> Téléphone : <a href="tel:+33123456789">01 23 45 67 89</a>
                            </p>
                        </div>
                        <Link to="/contact" className="btn-support">Nous Contacter</Link>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

export default Register;