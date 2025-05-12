import { useState } from 'react';
import "./App.css";

export default function App() {
  const [alunni, setAlunni] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAlunno, setNewAlunno] = useState({
    Nome: '',  
    Cognome: '' 
  });
  const [isAdding, setIsAdding] = useState(false);
  
  const caricaAlunni = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetch("http://localhost:8080/alunni")
        .then(response => response.json())
        .then(data => {
          setAlunni(data);
          setIsLoading(false);
        })
    }, 3000);
  };

  const handleSubmit = (e) => {
    setIsAdding(true);
    fetch("http://localhost:8080/alunni", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Nome: newAlunno.Nome,
        Cognome: newAlunno.Cognome
      })
    })  
    .then(data => {
      setAlunni(prev => [...prev, data]);
      setNewAlunno({ Nome: '', Cognome: '' }); 
      setIsAdding(false);
    })
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlunno(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='App'>
      <h1>Alunni</h1>
      <button 
        onClick={caricaAlunni} 
        disabled={isLoading}
        className="load-button"
      >
        Carica Alunni
      </button>
      {isLoading && <div className="loading-spinner"></div>}
      {!isLoading && alunni.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Cognome</th>
              </tr>
            </thead>
            <tbody>
              {alunni.map(alunno => (
                <tr key={alunno.id}>
                  <td>{alunno.id}</td>
                  <td>{alunno.nome}</td>
                  <td>{alunno.cognome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="form-container">
        <h2>Aggiungi Nuovo Alunno</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="Nome"
              name="Nome"
              value={newAlunno.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cognome">Cognome:</label>
            <input
              type="text"
              id="Cognome"
              name="Cognome"
              value={newAlunno.cognome}
              onChange={handleInputChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="action-button"
            disabled={isAdding}
          >
            Aggiungi Alunno
          </button>
        </form>
      </div>
    </div>
  );
}