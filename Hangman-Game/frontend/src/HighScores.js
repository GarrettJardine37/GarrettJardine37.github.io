import React, { useEffect, useState } from 'react';
import './HighScores.css';
import { Link } from "react-router-dom";

function HighScores({ resetGame, wordLength }) {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:2500/highscore/getHighScores/${wordLength}`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setScores(data))
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error.message);
      });
  }, [wordLength]);

  if (error) {
    return <div>Error fetching scores: {error}</div>;
  }

  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Guesses</th>
            <th>Word Length</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.id || index}> {/* Assuming each score has a unique 'id' */}
              <td>{score.name}</td>
              <td>{score.guesses}</td>
              <td>{score.wordLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={resetGame}>Play Again</button>

    </div>
  );
}

export default HighScores;