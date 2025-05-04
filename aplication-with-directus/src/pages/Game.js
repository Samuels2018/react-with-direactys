// src/pages/Game.tsx
import { useEffect, useState } from 'react';
import { createDirectus } from '@directus/sdk';
import { useParams } from 'react-router-dom';

const directus = createDirectus('http://tu-instancia-directus.com');

export default function Game() {
  const { gameId } = useParams();
  const [card, setCard] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [gameStatus, setGameStatus] = useState('en_progreso');
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Obtener el cartón asignado al jugador (esto debería venir de la sesión)
        const cardResponse = await directus.items('cards').readByQuery({
          filter: { juego: { _eq: gameId }, jugador: { _eq: 'jugador-actual-id' } },
          limit: 1
        });

        if (cardResponse.data && cardResponse.data.length > 0) {
          const cardData = cardResponse.data[0];
          const numbers = cardData.numeros;
          
          // Formatear el cartón para el estado
          const formattedCard = numbers.map(row => 
            row.map(value => ({ value, marked: false }))
          );
          
          setCard(formattedCard);
        }

        // Obtener números ya sorteados
        const numbersResponse = await directus.items('drawn_numbers').readByQuery({
          filter: { juego: { _eq: gameId } },
          sort: ['-fecha_hora_sorteo'],
          fields: ['numero']
        });

        if (numbersResponse.data) {
          setDrawnNumbers(numbersResponse.data.map(item => item.numero));
        }

        // Suscribirse a nuevos números sorteados
        const numbersSubscription = await directus.realtime.subscribe('drawn_numbers', {
          filter: { juego: { _eq: gameId } },
          query: { fields: ['numero'] }
        });

        numbersSubscription.subscribe((update) => {
          const newNumber = update.data[0].numero;
          setDrawnNumbers(prev => [...prev, newNumber]);
          
          // Marcar número en el cartón si existe
          setCard(prev => 
            prev.map(row => 
              row.map(cell => 
                cell.value === newNumber ? { ...cell, marked: true } : cell
              )
            )
          );
        });

        // Suscribirse a cambios en el estado del juego
        const gameSubscription = await directus.realtime.subscribe('games', {
          filter: { id: { _eq: gameId } },
          query: { fields: ['estado'] }
        });

        gameSubscription.subscribe((update) => {
          setGameStatus(update.data[0].estado);
        });

      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };

    initializeGame();
  }, [gameId]);

  // Verificar si hay bingo
  useEffect(() => {
    if (card.length === 0) return;

    // Verificar líneas horizontales
    const hasHorizontalBingo = card.some(row => row.every(cell => cell.marked));
    
    // Verificar líneas verticales
    const hasVerticalBingo = card[0].some((_, colIndex) => 
      card.every(row => row[colIndex].marked)
    );
    
    // Verificar diagonales
    const hasDiagonal1 = card.every((row, index) => row[index].marked);
    const hasDiagonal2 = card.every((row, index) => row[card.length - 1 - index].marked);

    if (hasHorizontalBingo || hasVerticalBingo || hasDiagonal1 || hasDiagonal2) {
      setIsWinner(true);
      // Aquí deberías registrar al ganador en Directus
    }
  }, [card]);

  if (isWinner) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-green-600 mb-4">¡BINGO!</h1>
        <p className="text-xl">¡Felicidades, has ganado!</p>
      </div>
    );
  }

  if (gameStatus !== 'en_progreso') {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">El juego no está en progreso</h1>
        <p>El estado actual es: {gameStatus.replace('_', ' ')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cartón de bingo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tu cartón</h2>
          <div className="grid grid-cols-5 gap-2">
            {card.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 flex items-center justify-center border rounded 
                    ${cell.marked ? 'bg-green-200' : 'bg-white'}`}
                >
                  {cell.value}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Números sorteados */}
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-semibold mb-4">Números sorteados</h2>
          <div className="flex flex-wrap gap-2">
            {drawnNumbers.map((num, index) => (
              <span 
                key={index}
                className="inline-block w-10 h-10 bg-blue-100 rounded-full 
                  flex items-center justify-center"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}