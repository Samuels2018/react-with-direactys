import clientAxios from "./clientAxios"

const getGamesService = (gameId, playerId) => {
  return clientAxios.get('/items/cards', {
    params: {
      filter: {
        juego: { _eq: gameId },
        jugador: { _eq: playerId },
      },
      limit: 1,
    }
  }).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al obtener los juegos');
    }
  })
}


// Obtener números ya sorteados


const getCardsService = (gameId, playerId) => {
  return clientAxios.get('/items/drawn_numbers', {
    params: {
      filter: {
        juego: { _eq: gameId },
        sort: ["-fecha_hora_sorteo"],
        fields: ["numero"]
      },
      limit: 1,
    }
  }).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al obtener las cartas');
    }
  })
}

/**
 * 
 * // Suscribirse a nuevos números sorteados
        const numbersSubscription = await directus.realtime.subscribe("drawn_numbers", {
          filter: { juego: { _eq: gameId } },
          query: { fields: ["numero"] },
        })
 * 
 * 
 */


const subscribeToDrawnNumbers = (gameId, callback, interval = 5000) => {
  const fetchNumbers = async () => {
    try {
      const response = await clientAxios.get('/items/drawn_numbers', {
        params: {
          filter: { juego: { _eq: gameId } },
          sort: ["-fecha_hora_sorteo"],
          fields: ["numero"],
        },
      });

      if (response.status === 200 && response.data.data) {
        callback(response.data.data); // Llama al callback con los datos obtenidos
      }
    } catch (error) {
      console.error('Error al obtener los números sorteados:', error);
    }
  };

  // Ejecutar la función periódicamente
  const intervalId = setInterval(fetchNumbers, interval);

  // Retornar una función para detener el polling
  return () => clearInterval(intervalId);
};


/**
 * 
 * 
 * // Suscribirse a cambios en el estado del juego
        const gameSubscription = await directus.realtime.subscribe("games", {
          filter: { id: { _eq: gameId } },
          query: { fields: ["estado"] },
        })
 * 
 */

const subscribeToGameState = (gameId, callback) => {
  const fetchGameState = async () => {
    try {
      const response = await clientAxios.get('/items/games', {
        params: {
          filter: { id: { _eq: gameId } },
          fields: ["estado"],
        },
      });

      if (response.status === 200 && response.data.data) {
        callback(response.data.data); // Llama al callback con los datos obtenidos
      }
    } catch (error) {
      console.error('Error al obtener el estado del juego:', error);
    }
  };

  // Ejecutar la función periódicamente
  const intervalId = setInterval(fetchGameState, 5000);

  // Retornar una función para detener el polling
  return () => clearInterval(intervalId);
}


/*
const response = await directus.items('games').readByQuery({
          filter: { estado: { _in: ['pendiente', 'en_progreso'] } },
          sort: ['-fecha_hora_inicio']


*/

const getGameState = async (gameId) => {
  try {
    const response = await clientAxios.get('/items/games', {
      params: {
        filter: { id: { _eq: gameId } },
        fields: ["estado"],
        sort: ["-fecha_hora_sorteo"],
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Error al obtener el estado del juego');
    }
  } catch (error) {
    console.error('Error al obtener el estado del juego:', error);
  }
}


export {
  getGamesService,
  getCardsService,
  subscribeToDrawnNumbers,
  subscribeToGameState,
  getGameState
}