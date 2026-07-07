import React from 'react';

const Loading: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="loading-container">
    <div className="spinner" />
    <p className="loading-message">{message}</p>
  </div>
);

export default Loading;
