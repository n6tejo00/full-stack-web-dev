import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';

// App komponentti
const App = (props) => {

  // Muuttuja selected pitää sisällään tilan arvon joka on 0. Muuttuja setSelected on viite funktioon, jonka avulla tilaa voidaan muuttaa.
  const [selected, setSelected] = useState(0)

  const [voted, setVoted] = useState(0)

  // Handle Next Button actions
  const handleNext = () => {
    // Funktio setSelected muuttaa selected muuttujan arvon. Uusi arvo on anecdotes arrayn random rivinumero.
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  // Handle Vote Button actions
  const handleVote = () => {
    // Funktio setVoted muuttaa voted muuttujan arvon. Uusi arvo on copy arrayn selected arvo kasvatettuna yhdellä.
    setVoted(copy[selected] += 1)
  }

  const votes = copy[selected]

  // Get largest integer from array
  var largest = Math.max.apply(0, copy);

  // Funktio palauttaa arrayn indexin suurimman arvon kohdalta
  function getIndex(element) {
    return element === largest
  }

  const mostVotedIndex = copy.findIndex(getIndex)

  return (
    <div>
      <div id="anecdotes"> 
        <h5>Anecdote of the day</h5>
        <p> {anecdotes[selected]} </p>
        <p> has {votes}  votes </p>
        <h5>Anecdote with most votes</h5>
        <p> {anecdotes[mostVotedIndex]} </p>
        <p>has {largest} votes</p>
      </div>
      <button onClick={handleVote}> vote </button>
      <button onClick={handleNext}> next </button>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

// New array filled with 0
const points = Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf,0);
  
// Copy array
const copy = [...points]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)