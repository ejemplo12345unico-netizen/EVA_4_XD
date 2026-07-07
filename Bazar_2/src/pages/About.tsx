import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const About = () => (
  <div className="page-container">
    <header className="page-header">
      <div>
        <p className="eyebrow">Sobre Nosotros</p>
        <h1 className="page-title">Quiénes Somos</h1>
        <p className="page-subtitle">Comprometidos con la salud natural y la sostenibilidad</p>
      </div>
      <div className="nav-actions">
        <Link to="/">Volver al inicio</Link>
      </div>
    </header>

    <div className="about-section" style={{ paddingTop: 20 }}>
      <div className="about-content">
        <div className="about-text">
          <h2>Nuestra Misión</h2>
          <p>
            En Verde Limón buscamos ofrecer productos naturales, orgánicos y sostenibles que
            promuevan el bienestar. Seleccionamos cuidadosamente cada artículo y trabajamos
            con proveedores responsables.
          </p>
          <ul className="about-list">
            <li>✓ Productos 100% naturales y orgánicos</li>
            <li>✓ Proveedores certificados</li>
            <li>✓ Empaques ecológicos</li>
            <li>✓ Envío rápido y seguro</li>
          </ul>
        </div>
        <div className="about-image">
          <div className="about-card">
            <span className="big-icon">🌱</span>
            <p>Amamos lo natural y lo compartimos contigo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
