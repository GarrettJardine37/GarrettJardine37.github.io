import React, { useState, useEffect } from 'react';
import './Game.css';

function Game({ name, endGame, word, wordLength }) {
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);



  const handleGuess = (letter) => {

    if (guesses.includes(letter)) {
      alert('You already guessed that letter.');
      return;
    }

    setGuesses([...guesses, letter]);

    if (word.includes(letter)) {
      const allLettersGuessed = word.split('').every(char => guesses.includes(char) || char === letter);
      if (allLettersGuessed) {
        setGameWon(true);
        saveScore();
      }
    } else {
      setIncorrectGuesses([...incorrectGuesses, letter]);
      setRemainingAttempts(remainingAttempts - 1);
      if (remainingAttempts - 1 === 0) {
        setGameOver(true);
      }
    }
  };

  const saveScore = () => {
    console.log(name, guesses.length, word.length);
    fetch('http://localhost:2500/highscore/addHighScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        guesses: guesses.length,
        wordLength: word.length,
      })
    })
    endGame();

  };

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>Game Over, you lost</h2>
        <p>The word was: {word}</p>
        <button onClick={endGame}>View High Scores</button>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="game-won">
        <h2>Congratulations, {name}!</h2>
        <p>You guessed the word: {word}</p>
        <button onClick={endGame}>View High Scores</button>
      </div>
    );
  }

  return (
    <div className="game">
      <h2>Hangman</h2>
      <p>Guess the word:</p>
      <div className="word">
        {word.split('').map((letter, index) => (
          <span key={index} className="letter">
            {guesses.includes(letter) ? letter : '_'}
          </span>
        ))}
      </div>
      <div className="letters">
        {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
          <button key={letter} onClick={() => handleGuess(letter)} disabled={guesses.includes(letter)}>
            {letter}
          </button>
        ))}
      </div>
      <div className="incorrect-guesses">
        <p>Incorrect guesses: {incorrectGuesses.join(', ')}</p>
        <p>Remaining attempts: {remainingAttempts}</p>
      </div>
    </div>
  );
}

export default Game;
