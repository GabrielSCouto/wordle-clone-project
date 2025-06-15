import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Busca dados da nossa API no back-end
    fetch('http://localhost:3001/api/healthcheck')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setMessage('Não foi possível conectar à API.');
      });
  }, []); // O array vazio [] faz com que isso rode apenas uma vez

  return (
    <div className="App">
      <h1>Clone do Termo</h1>
      <p>
        Status da API: <strong>{message}</strong>
      </p>
    </div>
  );
}

export default App;
