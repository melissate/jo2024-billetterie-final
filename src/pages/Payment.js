import React from 'react';
import '../css/Payment.css';

const Payment = () => {
  return (
    <div className="payment-page">
      <header className="payment-header">
        <h1>Finalisez votre achat pour assister aux Jeux Olympiques 2024</h1>
      </header>

      <main className="payment-content">
        <section className="payment-methods">
          <h2>Méthodes de paiement</h2>
          <div className="card-box">
            <img src="/images/payment-logos.png" alt="Visa, Mastercard, PayPal" />
            <p>Transaction sécurisée<br /><small>Garantie de remboursement</small></p>
          </div>
        </section>

        <section className="how-it-works">
          <h2>Comment ça marche</h2>
          <ul>
            <li>✅ Sélection du billet</li>
            <li>✅ Vérification des informations</li>
            <li>✅ Confirmation et paiement</li>
          </ul>
        </section>

        <section className="payment-support">
          <h2>📩 Besoin d’aide ?</h2>
          <p>
            Pour toute question ou problème avec votre paiement,
            contactez notre service d’assistance en ligne.
          </p>
          <button className="btn-red">Contactez-nous</button>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Payment;
