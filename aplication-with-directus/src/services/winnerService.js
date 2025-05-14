import clientAxios from "./clientAxios";


/*
await directus.items('winners').readByQuery({
          filter: { juego: { _eq: gameId } },
          fields: ['*', 'jugador.nombre', 'jugador.avatar', 'carton.id'],
          limit: 1
        });

*/

const getWinners = async (gameId) => {
  try {
    const response = await clientAxios.get('/items/winners', {
      params: {
        filter: { juego: { _eq: gameId } },
        fields: ['*', 'jugador.nombre', 'jugador.avatar', 'carton.id'],
        limit: 1,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Error al obtener los ganadores');
    }
  } catch (error) {
    console.error('Error al obtener los ganadores:', error);
  }
}

export default getWinners;