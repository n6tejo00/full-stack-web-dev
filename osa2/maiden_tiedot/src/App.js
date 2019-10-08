import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Filter komponentti määrittää filter muuttujan arvoksi inputin arvon ja synkronoi filterin uuden tilan handleFilter-tapahtumankäsittelijän kautta
const Filter = (props) =>
  <input value={props.filter} onChange={props.handleFilter} />

const App = () => {
  // Maiden tila saadaan useEffect funktion avulla
  const [countries, setCountries] = useState([])
  // Filterin tila
  const [filter, setFilter] = useState('')
  // Muuttujaan tallennetaan lista maista filterin mukaan
  const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  // Säätiedot API Key
  const API_Key = '69caa6ffa34c4836966122649191708'
  // Maan säätiedot tallennetaan tilaan taulukkona
  const [weather, setWeather] = useState([])
  // Maa johon haku kohdistuu
  var currentCountry = 'finland'
  // Säätietojen url
  var URL = ''

  // Haetaan maiden tiedot palvelimelta
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        // Asetetaan maiden tilaksi haettu data
        setCountries(response.data)
      })
  }, [])


  // Haetaan säätiedot palvelimelta
  useEffect(() => {
    axios
      .get(URL)
      .then(response => {
        // Asetetaan säätietojen tilaksi haettu data
        setWeather(response.data)
      })
  }, [])
  
    console.log('weather',weather.current, URL)


  // Tarkistetaan mitkä maat näytetään
  const Check = () => {
    // Listataan kaikki maat
    const rows = () => countriesToShow.map(country =>
      <p key={country.name}> {country.name} </p>
    )
    // Jos hakukenttä on tyhjä näytetään kaikki rivit
    if (filter === '') {
      return (
        rows()
      )
    }
    // Yli kymmenen riviä
    else if (rows().length > 10) {
      console.log('jos yli kymmenen riviä:',rows().length)
      return(
      <p>Too many matches, specify another filter</p>)
    }
    // 1 - 10 riviä
    else if (rows().length > 1 & rows().length < 10) {
      console.log('jos alle kymmenen riviä:',rows().length)
      return(
        rows()
      )
    }
    // 1 rivi
    else if (rows().length === 1) {
      currentCountry = countriesToShow.map(country => country.name)
      console.log(currentCountry)
      URL = 'https://api.apixu.com/v1/current.json?key=' + API_Key + '&q=' + currentCountry
      console.log(URL)
      return(
        countriesToShow.map(country =>
          <div key={country.name}>
            <h1>{country.name}</h1>
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h2>Languages</h2>
            <ul>
              {country.languages.map(language => 
                <li key={language.name}>{language.name}</li>  
              )}
            </ul>
            <img src={country.flag} alt={country.name} width="100%"/>
          </div>
        )
      )
    }
  }

  // Tapahtumankäsittelijä synkronoi filter inputille tehdyt muutokset
  const handleFilter = (event) => {
    // Päivitetään tila - event.target.value viittaa inputin arvoon
    setFilter(event.target.value)
  }

  return (
    <div>
      Find countries <Filter filter={filter} handleFilter={handleFilter}/>
      <Check />
    </div>
  )

}

export default App;
