import React, { useState } from 'react';
import '../css/Contact.css';
// Import icons (you might need to install a library like react-icons)
// For example: npm install react-icons
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';


const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('📩 Message envoyé :', form);
    alert('Votre message a bien été envoyé ! Nous vous répondrons sous peu.');
    // Optionally clear the form after submission
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Nous sommes là pour répondre à toutes vos questions concernant les Jeux Olympiques de Paris 2024.</p>
      </header>

      <section className="contact-content-wrapper">
        <div className="contact-infos">
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <h3>Adresse</h3>
            <p>123 Rue de Paris, 75001 </p>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <h3>Téléphone</h3>
            <p>+33 1 23 45 67 89</p>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <h3>Email</h3>
            <p>contact@jeuxolympiques2024.fr</p>
          </div>
          {/* You could add a small map iframe here if desired */}
          {/* <div className="map-container">
            <iframe
              title="Paris 2024 Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916246369796!2d2.292292615671501!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964b732e7%3A0x286377e8a9f07f9c!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1678901234567!5m2!1sen!2sfr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div> */}
        </div>

        <div className="contact-form-section">
          <h2>Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Votre Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Votre nom complet"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Votre Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre.email@exemple.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Votre Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Écrivez votre message ici..."
                rows="6" // Increased rows for more space
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Envoyer le message</button>
          </form>
        </div>
      </section>

      
      {/* Footer - Keep as is */}
      <footer className="footer">
       
        <p>&copy; 2024 Jeux Olympiques France. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Contact;