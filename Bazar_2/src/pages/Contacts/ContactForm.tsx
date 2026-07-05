import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContactRequest } from '../types';
import { useContacts } from '../../hooks/useContacts';

type ContactFormData = Omit<ContactRequest, 'id'>;

const ContactForm = () => {
  const navigate = useNavigate();
  const { createContact } = useContacts();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    status: 'Pendiente',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await createContact({
        ...formData,
        createdAt: new Date().toISOString(),
      });
      navigate('/contactos');
    } catch {
      setError('No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="panel-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Contacto</p>
            <h2 style={{ margin: 0 }}>Formulario de contacto</h2>
          </div>
          <span className="pill">Nuevo mensaje</span>
        </div>
        <p style={{ textAlign: 'center', color: '#4b5563' }}>Tu mensaje será registrado en la administración de Verde Limón.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 12 }}>
          <div>
            <label style={{ fontWeight: '700' }}>Nombre</label>
            <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Correo</label>
            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Teléfono</label>
            <input className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Mensaje</label>
            <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} rows={5} />
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Registrar solicitud</button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
