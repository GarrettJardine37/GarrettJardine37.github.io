import React, { useState } from 'react';
import Game from './Game';
import HighScores from './HighScores';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [name, setName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [wordLength, setWordLength] = useState(0);

  async function startGame(playerName) {
    try {
      await setPlayerNameInSession(playerName);
      const response = await fetch('http://localhost:2500/words/getRandomWord');
      const data = await response.json();
      setWord(data); 
      setName(playerName);
      setIsPlaying(true);
      setWordLength(data.length)
      setShowHighScores(false);
    } catch (error) {
      console.error('Error fetching random word:', error);
    }
  }

  const showScores = () => {
    setIsPlaying(false);
    setShowHighScores(true);
  };

  const resetGame = () => {
    console.log(name)

    startGame(name)
    setIsPlaying(true);
    setShowHighScores(false);
    {isPlaying && <Game name={name} endGame={showScores} word={word} wordLength={wordLength} />}
    {showHighScores && <HighScores resetGame={resetGame} wordLength={wordLength} />}
  };

  const setPlayerNameInSession = async (playerName) => {
    try {
      const response = await fetch('http://localhost:2500/words/setName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error setting player name:', error);
    }
  };

  return (
    <div className="App">
      {!isPlaying && !showHighScores && (
        <div className="start-screen">
          <h1>Welcome to Hangman</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={() => startGame(name)}>Start Game</button>
        </div>
      )}
      {isPlaying && <Game name={name} endGame={showScores} word={word} wordLength={wordLength} />}
      {showHighScores && <HighScores resetGame={resetGame} wordLength={wordLength} />}
    </div>
  );
}

export default App;
