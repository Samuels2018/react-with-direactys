export function generateBingoCard(){
  // Estructura 5x5 con espacio libre en el centro
  const card= [[], [], [], [], []];
  
  // Rangos para cada columna (B, I, N, G, O)
  const ranges = [
    { min: 1, max: 15 },   // B
    { min: 16, max: 30 },  // I
    { min: 31, max: 45 },  // N
    { min: 46, max: 60 },  // G
    { min: 61, max: 75 }   // O
  ];

  // Generar números para cada columna
  for (let col = 0; col < 5; col++) {
    const numbers = new Set();
    const { min, max } = ranges[col];
    
    // Llenar cada fila (excepto la mitad si es la columna N)
    for (let row = 0; row < 5; row++) {
      if (col === 2 && row === 2) { // Espacio libre en el centro
        card[row][col] = 0;
        continue;
      }
      
      let num;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (numbers.has(num));
      
      numbers.add(num);
      card[row][col] = num;
    }
  }

  return {
    id: Math.random().toString(36).substring(2, 10),
    numbers: card
  };
}

// Función para generar múltiples cartones
export function generateMultipleCards(count) {
  return Array.from({ length: count }, () => generateBingoCard());
}