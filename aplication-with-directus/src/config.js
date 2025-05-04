// src/config.ts
export const config = {
  directusUrl: process.env.VITE_DIRECTUS_URL,
  defaultGameId: process.env.VITE_DEFAULT_GAME_ID,
  maxCardsPerPlayer: parseInt(process.env.VITE_MAX_CARDS_PER_PLAYER || '4', 10),
  
  // Puedes añadir más configuraciones aquí
  endpoints: {
    games: '/items/games',
    players: '/items/players',
    cards: '/items/cards'
  }
};