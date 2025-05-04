// src/pages/Lobby.tsx
import { useEffect, useState } from 'react';
import { createDirectus } from '@directus/sdk';
import { useParams, useNavigate } from 'react-router-dom';

//const directus = new createDirectus('http://tu-instancia-directus.com');

export default function Lobby() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Obtener detalles del juego
        const gameResponse = [] /*await directus.items('games').readOne(gameId, {
          fields: ['id', 'nombre', 'estado']
        });*/
        setGame(gameResponse);

        // Obtener jugadores (usando una colección intermedia si es necesario)
        const playersResponse = [] /*await directus.items('players').readByQuery({
          filter: { juegos: { _eq: gameId } },
          fields: ['id', 'nombre', 'avatar']
        });*/
        setPlayers(playersResponse.data || []);

        // Suscribirse a cambios en el estado del juego
        const subscription = [] /*await directus.realtime.subscribe('games', {
          filter: { id: { _eq: gameId } },
          query: { fields: ['estado'] }
        });*/

        subscription.subscribe((update) => {
          if (update.data[0].estado === 'en_progreso') {
            navigate(`/game/${gameId}`);
          }
        });

      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, navigate]);

  if (loading) return <div>Cargando sala de espera...</div>;
  if (!game) return <div>Juego no encontrado</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sala de espera: {game.nombre}</h1>
      <p className="text-lg mb-6">Esperando a que comience el juego...</p>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Jugadores conectados ({players.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map(player => (
            <div key={player.id} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 overflow-hidden">
                {player.avatar && (
                  <img 
                    src={`http://tu-instancia-directus.com/assets/${player.avatar}`} 
                    alt={player.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-sm">{player.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}