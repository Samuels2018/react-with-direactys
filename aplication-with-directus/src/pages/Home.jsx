"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        /*const response = await getGameState(gameId)
        });*/
        const response = []
        setGames(response.data || [])
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()

    // Para demostración, añadimos algunos juegos de ejemplo
    setTimeout(() => {
      setGames([
        {
          id: 1,
          nombre: "Bingo Nocturno",
          estado: "pendiente",
          premio: "$500.000",
          fecha_hora_inicio: new Date().toISOString(),
        },
        {
          id: 2,
          nombre: "Super Bingo Familiar",
          estado: "en_progreso",
          premio: "$1.000.000",
          fecha_hora_inicio: new Date().toISOString(),
        },
        {
          id: 3,
          nombre: "Bingo Relámpago",
          estado: "pendiente",
          premio: "$300.000",
          fecha_hora_inicio: new Date().toISOString(),
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // Función para obtener el color de fondo según el estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-amber-100 text-amber-800"
      case "en_progreso":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para formatear el estado
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="flex space-x-2 justify-center">
            <div className="h-8 w-8 bg-red-500 rounded-full animate-bounce"></div>
            <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="h-8 w-8 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="mt-4 text-gray-600">Cargando juegos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header con temática de bingo */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-2 mb-4">
          {["B", "I", "N", "G", "O"].map((letter, index) => (
            <div
              key={letter}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                index === 1 ? "bg-blue-500" : "bg-gray-200 text-gray-500"
              }`}
            >
              {letter}
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Juegos de Bingo Disponibles</h1>
        <p className="text-center text-gray-600 mb-8">
          ¡Únete a nuestros emocionantes juegos de bingo y gana premios increíbles!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex border-b">
                <div className="w-1/5 h-1 bg-red-500"></div>
                <div className="w-1/5 h-1 bg-blue-500"></div>
                <div className="w-1/5 h-1 bg-green-500"></div>
                <div className="w-1/5 h-1 bg-yellow-500"></div>
                <div className="w-1/5 h-1 bg-pink-500"></div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{game.nombre}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(game.estado)}`}>
                    {formatStatus(game.estado)}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                      $
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Premio</p>
                      <p className="font-medium">{game.premio}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha</p>
                      <p className="font-medium">{new Date(game.fecha_hora_inicio).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
                  Unirse al juego
                </button>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <div className="flex justify-center space-x-2 mb-4">
              {["B", "I", "N", "G", "O"].map((letter) => (
                <div
                  key={letter}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-xl font-medium text-gray-700 mb-2">No hay juegos disponibles</p>
            <p className="text-gray-500 mb-4">No hay juegos disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  )
}




/*import { useEffect, useState } from 'react';
import { createDirectus, rest, readItems } from '@directus/sdk';
import axios from 'axios';


export default function Home() {
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        //const response = await directus.items('games').readByQuery({
        //  filter: { estado: { _in: ['pendiente', 'en_progreso'] } },
        //  sort: ['-fecha_hora_inicio']
        //});
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
}*/