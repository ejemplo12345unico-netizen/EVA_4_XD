const Loading = ({ message = 'Cargando...' }: { message?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 32 }}>
    <div className="spinner" />
    <p style={{ color: '#4b5563', fontWeight: 600 }}>{message}</p>
  </div>
);

export default Loading;
