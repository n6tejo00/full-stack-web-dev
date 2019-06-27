import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const Statistic = (props) => {
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            {props.text}
                        </td>
                        <td>
                            {props.value}
                            {props.text2}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const Statistics = ({good, neutral, bad, total, avg, positive}) => {
    total = good + neutral + bad
    avg = (good*1 + neutral*0 + bad*-1) / total
    positive = good * 100 / total
    if (total === 0) {
        return (
            <div>
                <h1>Statistiikka</h1>
                <p>Ei yhtään palautetta annettu</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Statistiikka</h1>
                <Statistic text="hyvä" value={good} />
                <Statistic text="neutraali" value={neutral} />
                <Statistic text="huono" value={bad} />
                <Statistic text="yhteensä" value={total} />
                <Statistic text="keskiarvo" value={avg} />
                <Statistic text="positiivisia" value={positive} text2=" %" />
            </div>
        )
    }
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = (props) => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const setToValueGood = (value) => setGood(value)

  const [neutral, setNeutral] = useState(0)
  const setToValueNeutral = (value) => setNeutral(value)

  const [bad, setBad] = useState(0)
  const setToValueBad = (value) => setBad(value)

  return (
    <div>
        <h1>Anna palautetta</h1>
        <Button
            handleClick={() => setToValueGood(good + 1)}
            text='hyvä'
        />
        <Button
            handleClick={() => setToValueNeutral(neutral + 1)}
            text='neutraali'
        />
        <Button
            handleClick={() => setToValueBad(bad + 1)}
            text='huono'
        />
        <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)