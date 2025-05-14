import clientAxios from "./clientAxios"

/*
await directus.items('games').readOne(gameId, {
          fields: ['id', 'nombre', 'estado']
        });

*/

const lobbyGameState = async (gameId) => {
  try {
    const response = await clientAxios.get(`/items/games/${gameId}`, {
      params: {
        fields: ['id', 'nombre', 'estado'],
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

/*

await directus.items('players').readByQuery({
          filter: { juegos: { _eq: gameId } },
          fields: ['id', 'nombre', 'avatar']
        });
*/


const lobbyGetPlayers = async (gameId) => {
  try {
    const response = await clientAxios.get('/items/players', {
      params: {
        filter: { juegos: { _eq: gameId } },
        fields: ['id', 'nombre', 'avatar'],
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Error al obtener los jugadores');
    }
  } catch (error) {
    console.error('Error al obtener los jugadores:', error);
  }
}

/*

await directus.realtime.subscribe('games', {
          filter: { id: { _eq: gameId } },
          query: { fields: ['estado'] }
        })

*/

const lobbySubscribeToGameState = (gameId, callback) => {
  const fetchGameState = async () => {
    try {
      const response = await clientAxios.get('/items/games', {
        params: {
          filter: { id: { _eq: gameId } },
          fields: ['estado'],
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

export {
  lobbyGameState,
  lobbyGetPlayers,
  lobbySubscribeToGameState,
}