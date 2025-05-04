// src/pages/Register.tsx
import { useState } from 'react';
import { createDirectus } from '@directus/sdk';
import { useNavigate } from 'react-router-dom';

//onst directus = new createDirectus('http://tu-instancia-directus.com');

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Crear jugador en Directus
      /*await directus.items('players').createOne({
        nombre: name,
        email: email,
        fecha_registro: new Date().toISOString()
      });*/

      // Redirigir al lobby
      navigate('/lobby');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registro para el Bingo</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}