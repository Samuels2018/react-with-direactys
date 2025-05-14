import clientAxios from "./clientAxios"


/*

// Crear jugador en Directus
/await directus.items('players').createOne({
nombre: name,
email: email,
fecha_registro: new Date().toISOString()
});/

*/

const registerService = (valores) => {
  console.log('Valores en el servicio:', valores)
  return clientAxios.post('/items/players', valores).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al registrar el jugador');
    }
  })
}

export default registerService