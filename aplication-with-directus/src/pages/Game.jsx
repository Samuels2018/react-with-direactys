"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  getGamesService, 
  getCardsService, 
  subscribeToDrawnNumbers,
  subscribeToGameState
} from "../services/gameService"

export default function Game() {
  const { gameId } = useParams()
  const [card, setCard] = useState([])
  const [drawnNumbers, setDrawnNumbers] = useState([])
  const [gameStatus, setGameStatus] = useState("en_progreso")
  const [isWinner, setIsWinner] = useState(false)
  const [lastDrawnNumber, setLastDrawnNumber] = useState(null)

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Obtener el cartón asignado al jugador (esto debería venir de la sesión)
        const cardResponse = await getGamesService(gameId, "jugador-actual-id" )

        if (cardResponse.data && cardResponse.data.length > 0) {
          const cardData = cardResponse.data[0]
          const numbers = cardData.numeros

          // Formatear el cartón para el estado
          const formattedCard = numbers.map((row) => row.map((value) => ({ value, marked: false })))

          setCard(formattedCard)
        }

        // Obtener números ya sorteados
        const numbersResponse = await getCardsService(gameId)

        if (numbersResponse.data) {
          const numbers = numbersResponse.data.map((item) => item.numero)
          setDrawnNumbers(numbers)
          if (numbers.length > 0) {
            setLastDrawnNumber(numbers[numbers.length - 1])
          }
        }

        // Suscribirse a nuevos números sorteados
        const numbersSubscription = await subscribeToDrawnNumbers(gameId)


        numbersSubscription.subscribe((update) => {
          const newNumber = update.data[0].numero
          setDrawnNumbers((prev) => [...prev, newNumber])
          setLastDrawnNumber(newNumber)

          // Marcar número en el cartón si existe
          setCard((prev) =>
            prev.map((row) => row.map((cell) => (cell.value === newNumber ? { ...cell, marked: true } : cell))),
          )
        })

        // Suscribirse a cambios en el estado del juego
        const gameSubscription = await subscribeToGameState(gameId)

        gameSubscription.subscribe((update) => {
          setGameStatus(update.data[0].estado)
        })
      } catch (error) {
        console.error("Error initializing game:", error)
      }
    }

    initializeGame()
  }, [gameId])

  // Verificar si hay bingo
  useEffect(() => {
    if (card.length === 0) return

    // Verificar líneas horizontales
    const hasHorizontalBingo = card.some((row) => row.every((cell) => cell.marked))

    // Verificar líneas verticales
    const hasVerticalBingo = card[0].some((_, colIndex) => card.every((row) => row[colIndex].marked))

    // Verificar diagonales
    const hasDiagonal1 = card.every((row, index) => row[index].marked)
    const hasDiagonal2 = card.every((row, index) => row[card.length - 1 - index].marked)

    if (hasHorizontalBingo || hasVerticalBingo || hasDiagonal1 || hasDiagonal2) {
      setIsWinner(true)
      // Aquí deberías registrar al ganador en Directus
    }
  }, [card])

  if (isWinner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 text-yellow-500 flex items-center justify-center">
              <div className="w-16 h-20 bg-yellow-500 rounded-lg relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full border-4 border-yellow-500"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-yellow-600 rounded"></div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-red-600 mb-4 tracking-tight">¡BINGO!</h1>
          <p className="text-2xl font-medium text-gray-700 mb-6">¡Felicidades, has ganado!</p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 text-yellow-300 animate-pulse flex items-center justify-center">
                <div className="relative">
                  <div className="absolute h-4 w-4 bg-yellow-300 rounded-full -top-8 left-0 animate-ping"></div>
                  <div className="absolute h-3 w-3 bg-yellow-300 rounded-full top-2 -left-10 animate-ping delay-100"></div>
                  <div className="absolute h-5 w-5 bg-yellow-300 rounded-full -top-4 -right-8 animate-ping delay-200"></div>
                  <div className="absolute h-3 w-3 bg-yellow-300 rounded-full -bottom-6 -left-6 animate-ping delay-300"></div>
                  <div className="absolute h-4 w-4 bg-yellow-300 rounded-full -bottom-8 right-0 animate-ping delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameStatus !== "en_progreso") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 text-amber-500 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-amber-500 flex items-center justify-center">
                <div className="font-bold text-2xl text-amber-500">!</div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">El juego no está en progreso</h1>
          <p className="text-xl text-gray-600">El estado actual es: {gameStatus.replace("_", " ")}</p>
        </div>
      </div>
    )
  }

  // Función para determinar el color de la columna del bingo
  const getBingoColumnColor = (colIndex) => {
    const colors = [
      "bg-red-500 text-white", // B
      "bg-blue-500 text-white", // I
      "bg-green-500 text-white", // N
      "bg-yellow-500 text-gray-800", // G
      "bg-purple-500 text-white", // O
    ]
    return colors[colIndex % 5]
  }

  // Función para determinar el color de la letra del bingo
  const getBingoLetter = (colIndex) => {
    return ["B", "I", "N", "G", "O"][colIndex % 5]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mb-2">
            BINGO GAME
          </h1>
          <p className="text-gray-600 text-lg">¡Buena suerte!</p>
        </header>

        {lastDrawnNumber && (
          <div className="mb-8 text-center">
            <div className="inline-block">
              <p className="text-sm font-medium text-gray-500 mb-1">Último número sorteado</p>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-1 shadow-lg mx-auto animate-pulse">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-600">{lastDrawnNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cartón de bingo */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex-1">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
              <h2 className="text-xl font-bold text-center">Tu Cartón de Bingo</h2>
            </div>

            <div className="p-6">
              {/* Encabezado BINGO */}
              <div className="grid grid-cols-5 gap-2 mb-2">
                {["B", "I", "N", "G", "O"].map((letter, index) => (
                  <div
                    key={`header-${index}`}
                    className={`h-10 flex items-center justify-center rounded-t-lg font-bold text-lg ${getBingoColumnColor(index)}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {/* Números del cartón */}
              <div className="grid grid-cols-5 gap-2">
                {card.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative h-14 md:h-16 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-200 
                        ${
                          cell.marked
                            ? "bg-gradient-to-r from-red-100 to-pink-100 border-red-500 shadow-inner"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      <span className="text-xs text-gray-400 absolute top-1 left-1">{getBingoLetter(colIndex)}</span>
                      <span className={`text-xl font-bold ${cell.marked ? "text-red-600" : "text-gray-800"}`}>
                        {cell.value}
                      </span>
                      {cell.marked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-red-500 opacity-70"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>

          {/* Números sorteados */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full lg:w-1/3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
              <h2 className="text-xl font-bold text-center">Números Sorteados</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {drawnNumbers.length === 0 ? (
                  <p className="text-gray-500 italic py-4">Esperando el primer número...</p>
                ) : (
                  drawnNumbers.map((num, index) => {
                    // Determinar el color basado en el rango del número
                    let bgColor = "bg-red-100 border-red-400 text-red-700" // B: 1-15
                    if (num > 15 && num <= 30)
                      bgColor = "bg-blue-100 border-blue-400 text-blue-700" // I: 16-30
                    else if (num > 30 && num <= 45)
                      bgColor = "bg-green-100 border-green-400 text-green-700" // N: 31-45
                    else if (num > 45 && num <= 60)
                      bgColor = "bg-yellow-100 border-yellow-400 text-yellow-800" // G: 46-60
                    else if (num > 60) bgColor = "bg-purple-100 border-purple-400 text-purple-700" // O: 61-75

                    const letter = num <= 15 ? "B" : num <= 30 ? "I" : num <= 45 ? "N" : num <= 60 ? "G" : "O"

                    return (
                      <div
                        key={index}
                        className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-full border-2 ${bgColor}`}
                      >
                        <span className="text-xs absolute top-0.5">{letter}</span>
                        <span className="font-bold">{num}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



/*import { useEffect, useState } from 'react';
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
}*/