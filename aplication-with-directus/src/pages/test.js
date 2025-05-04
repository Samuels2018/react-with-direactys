import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Test () {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // token 7bkxnOxifROVu_ZO9nB9N-6bnQopGJ76

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const username = 'admin@example.com'; // Reemplaza con tus credenciales
        const password = 'password123'; // Reemplaza con tus credenciales
        
        /*const loginRes = await axios.post('http://0.0.0.0:8055/auth/login', {
          email: 'm@gmail.com',
          password: '12345'
        });
        const token = loginRes.data.data.access_token;
        console.log('Token:', token);*/

        const access_token = '7bkxnOxifROVu_ZO9nB9N-6bnQopGJ76';

        const response = await axios.get('http://localhost:8055/items/cards', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setCards(response.data.data);
        setLoading(false);

        console.log(response.data);
        
        setCards(response.data.data); // Directus devuelve los datos en response.data.data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);
}