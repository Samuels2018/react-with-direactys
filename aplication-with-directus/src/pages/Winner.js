// src/pages/Winner.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getWinners from '../services/winnerService';

export default function Winner() {
  const { gameId } = useParams();
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = [] /*await getWinners(gameId) */

        if (response.data && response.data.length > 0) {
          setWinner(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching winner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinner();
  }, [gameId]);

  if (loading) return <div>Cargando información del ganador...</div>;

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-8">¡Tenemos un ganador!</h1>
      
      {winner ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            {winner.jugador.avatar && (
              <img 
                src={`http://tu-instancia-directus.com/assets/${winner.jugador.avatar}`}
                alt={winner.jugador.nombre}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
            )}
            <h2 className="text-2xl font-semibold">{winner.jugador.nombre}</h2>
            <p className="text-gray-600 mt-2">Cartón ganador: #{winner.carton.id}</p>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium">Premio:</p>
              <p className="text-xl">{winner.premio}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No se ha encontrado información del ganador para este juego.</p>
      )}
    </div>
  );
}