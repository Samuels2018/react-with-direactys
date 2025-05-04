// src/context/BingoContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Directus } from '@directus/sdk';
import { config } from '../config';


const initialState = {
  player: null,
  currentGame: null,
  cards: [],
  drawnNumbers: [],
  isLoading: false,
  error: null
};

const bingoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_GAME':
      return { ...state, currentGame: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'ADD_DRAWN_NUMBER':
      return { ...state, drawnNumbers: [...state.drawnNumbers, action.payload] };
    case 'MARK_NUMBER':
      return {
        ...state,
        cards: state.cards.map(card => ({
          ...card,
          numbers: card.numbers.map((row, rIdx) =>
            rIdx === action.payload.row
              ? row.map((num, cIdx) =>
                  cIdx === action.payload.col ? { ...num, marked: true } : num
                )
              : row
          )
        }))
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const BingoContext = createContext<{
  state,
  dispatch,
  directus
}>({
  state: initialState,
  dispatch: () => null,
  directus: new Directus(config.directusUrl)
});

export const BingoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bingoReducer, initialState);
  const directus = new Directus(config.directusUrl);

  // Efecto para suscribirse a cambios en el juego actual
  useEffect(() => {
    if (!state.currentGame?.id) return;

    const subscribeToGame = async () => {
      try {
        const subscription = await directus.realtime.subscribe('games', {
          filter: { id: { _eq: state.currentGame?.id } },
          query: { fields: ['estado'] }
        });

        subscription.subscribe((update) => {
          if (update.data[0].estado !== state.currentGame?.estado) {
            dispatch({
              type: 'SET_GAME',
              payload: { ...state.currentGame, estado: update.data[0].estado }
            });
          }
        });
      } catch (error) {
        console.error('Error subscribing to game:', error);
      }
    };

    subscribeToGame();
  }, [state.currentGame?.id]);

  return (
    <BingoContext.Provider value={{ state, dispatch, directus }}>
      {children}
    </BingoContext.Provider>
  );
};

export const useBingo = () => useContext(BingoContext);