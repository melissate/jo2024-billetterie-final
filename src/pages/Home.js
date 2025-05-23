import React from 'react';
import '../css/Home.css';


const Home = () => {
  return (
    <div className="home">
     
      {/* Section Offres - Readapted to match image */}
      <section className="offers-section-redesign">
        <div className="offers-content">
          <h2>Choisissez l'offre qui vous convient</h2>
          <p>Découvrez nos offres de billets pour les Jeux Olympiques 2024. Que vous soyez seul, en duo ou en famille, nous avons une option qui vous convient.</p>
          <div className="offers-grid-redesign">
            <div className="offer-card-redesign">
              <span className="offer-icon">🎟️</span> {/* Placeholder icon */}
              <h3>Billet Solo : 1 place</h3>
              <p>valable pour un événement au choix</p>
            </div>
            <div className="offer-card-redesign">
              <span className="offer-icon">👥</span> {/* Placeholder icon */}
              <h3>Billet Duo : 2 places</h3>
              <p>découvrez Paris avec vos proches</p>
            </div>
            <div className="offer-card-redesign">
              <span className="offer-icon">👨‍👩‍👧‍👦</span> {/* Placeholder icon */}
              <h3>Billet Famille : 4 places</h3>
              <p>profitez d'une journée pour toute la famille</p>
            </div>
          </div>
          <div className="offers-actions">
            <button className="btn-offers">Réserver</button>
            <button className="btn-offers btn-outline-offers">En savoir plus</button>
          </div>
        </div>
      </section>

      {/* Section Présentation des JO (now "Faits marquants...") - Readapted to match image */}
      <section className="facts-section">
        <div className="facts-image-container">
          <img src="https://cdn.pixabay.com/photo/2018/09/01/03/53/field-hockey-3646017_1280.jpg" alt="Two people looking at a laptop" className="facts-image" /> {/* Use your image */}
        </div>
        <div className="facts-content">
          <span className="subtitle">Statistiques</span>
          <h2>Faits marquants des précédents Jeux Olympiques</h2>
          <p>Les Jeux Olympiques rassemblent des millions de spectateurs, 2 millions de bénévoles, et des moments marquants qui ont façonné cette compétition légendaire.</p>
          <div className="stats-grid-redesign">
            <div className="stat-item">
              <p className="stat-number">80%</p>
              <span className="stat-description">des billets vendus en ligne</span>
            </div>
            <div className="stat-item">
              <p className="stat-number">3</p>
              <span className="stat-description">nouvelles disciplines en 2024</span>
            </div>
          </div>
          <div className="facts-actions">
            <button className="btn-facts-outline">Explorer</button>
          </div>
        </div>
      </section>



      {/* Footer - Keep as is */}
      <footer className="footer">
       
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;