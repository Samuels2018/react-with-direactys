// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { createDirectus, rest, readItems } from '@directus/sdk';
import axios from 'axios';


export default function Home() {
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        /*const response = await directus.items('games').readByQuery({
          filter: { estado: { _in: ['pendiente', 'en_progreso'] } },
          sort: ['-fecha_hora_inicio']
        });*/
        const response = []
        setGames(response.data || []);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Cargando juegos...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Juegos de Bingo Disponibles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(game => (
          <div key={game.id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold">{game.nombre}</h2>
            <p className="text-gray-600">Estado: {game.estado.replace('_', ' ')}</p>
            <p className="text-gray-600">Premio: {game.premio}</p>
            <p className="text-gray-600">
              Fecha: {new Date(game.fecha_hora_inicio).toLocaleString()}
            </p>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Unirse al juego
            </button>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl">No hay juegos disponibles en este momento</p>
        </div>
      )}
    </div>
  );
}