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
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const rimuoviAlunno = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo alunno?")) {
      setIsDeleting(true);
      fetch(`http://localhost:8080/alunni/${id}`, {
        method: 'DELETE'
      })  
      .then(response => {
        if (response.ok) {
          setAlunni(prev => prev.filter(alunno => alunno.id !== id));
        } else {
          console.error("Failed to delete student");
        }
      })
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    .then(response => response.json())
    .then(data => {
      setAlunni(prev => [...prev, data]);
      setNewAlunno({ Nome: '', Cognome: '' });
      setIsAdding(false);
      setShowForm(false); 
      caricaAlunni();
    })
    .catch(error => {
      console.error("Error adding student:", error);
      setIsAdding(false);
    });
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
      <div className="controls">
        <button 
          onClick={caricaAlunni} 
          disabled={isLoading}
          className="load-button"
        >
          Carica Alunni
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="action-button"
        >
          {showForm ? 'Annulla' : 'Aggiungi Alunno'}
        </button>
      </div>
      
      {isLoading && <div className="loading-spinner"></div>}
      
      {!isLoading && alunni.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Elimina</th>
              </tr>
            </thead>
            <tbody>
              {alunni.map(alunno => (
                <tr key={alunno.id}>
                  <td>{alunno.id}</td>
                  <td>{alunno.nome}</td>
                  <td>{alunno.cognome}</td>
                  <td>
                    <button
                      onClick={() => rimuoviAlunno(alunno.id)}
                      className="delete-button"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Eliminando...' : 'Rimuovi'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showForm && (
        <div className="form-container">
          <h2>Aggiungi Nuovo Alunno</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="Nome">Nome:</label>
              <input
                type="text"
                id="Nome"
                name="Nome"
                value={newAlunno.Nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Cognome">Cognome:</label>
              <input
                type="text"
                id="Cognome"
                name="Cognome"
                value={newAlunno.Cognome}
                onChange={handleInputChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="action-button"
              disabled={isAdding}
            >
              {isAdding ? 'Aggiungendo...' : 'Conferma Aggiunta'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}