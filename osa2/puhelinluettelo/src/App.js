import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Error from './components/Error'
import personService from './services/persons'

// Filter komponentti määrittää filter muuttujan arvoksi inputin arvon ja synkronoi filterin uuden tilan handleFIlter-tapahtumankäsittelijän kautta
const Filter = (props) =>
    <div>
        filter shows with: <input value={props.filter} onChange={props.handleFilter} />
    </div>

// Lomake
const PersonForm = (props) => 
    <div>
        <p>
            name:
            <input 
                /* Inputin value määrittää newName muuttujan arvon */
                value={props.newName}
                /* Tapahtumankäsittelijää kutsutaan aina kun syötekomponentissa tapahtuu jotain */
                onChange={props.handleNameChange}
            />
        </p>
        <p>
            number:
            <input 
                /* Inputin value määrittää newNumber muuttujan arvon */
                value={props.newNumber}
                /* Tapahtumankäsittelijää kutsutaan aina kun syötekomponentissa tapahtuu jotain */
                onChange={props.handleNumberChange}
            />
        </p>
        <p>
            <button onClick={() => props.handlePerson()}>add</button>
        </p>
    </div>

// Person komponentti tulostaa yksittäisen henkilön
const Person = ({ person, handleRemove }) => 
    <div>
        <p>
            {person.name} {person.number}
            {/* Välitetään poistettavan henkilön id handleRemove funktiolle */}
            <button onClick={() => handleRemove(person.id)}>Poista</button> 
        </p>
    </div>

// Persons komponentti hakee listan yhteystiedoista namesToShow muuttujasta
const Persons = (props) => props.namesToShow.map(person =>
    <Person key={person.name} person={person} handleRemove={props.handleRemove}/>
)

const App = (props) => {
    // Persons taulukon tila
    const [persons, setPersons] = useState([])
    // Uuden henkilön tila
    const [newName, setNewName] = useState('')
    // Uuden numeron tila
    const [newNumber, setNewNumber] = useState('')
    // Filtterin tila
    const [filter, setFilter] = useState('')
    // Muuttujaan tallennetaan lista persons-taulukon tiedoista filterin arvon mukaan
    const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    // Ilmoitukset
    const [message, setMessage] = useState(null)
    // Error
    const [errorMessage, setErrorMessage] = useState(null)

    // Haetaan data palvelimelta
    useEffect(() => {
        personService
          .getAll()
            .then(initialPersons => {
            setPersons(initialPersons)
          })
    }, [])

    // Uuden henkilön lisääminen
    const addPerson = () => {
        // Luodaan uutta henkilöä vastaava olio personObject
        const personObject = {
            // Sisältökenttien arvot saadaan komponentin tiloista newName ja newNumber
            name: newName,
            number: newNumber
        }
        // Uusi henkilö lisätään palvelimelle
        personService
            .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    // Tyhjennetään syötekenttiä kontrolloivat tilat
                    setNewName('')
                    setNewNumber('') 
                })
                // Ilmoitus
                .then(message => {
                    setMessage(
                      `Person '${newName}' added to the server.`
                    )
                    setTimeout(() => {
                      setMessage(null)
                    }, 5000)
                })
    }

    // Tapahtumankäsittelijä synkronoi name inputille tehdyt muutokset
    const handleNameChange = (event) => {
        // Päivitetään tila - event.target.value viittaa inputin arvoon
        setNewName(event.target.value)
    }

    // Tapahtumankäsittelijä synkronoi number inputille tehdyt muutokset
    const handleNumberChange = (event) => {
        // Päivitetään tila - event.target.value viittaa inputin arvoon
        setNewNumber(event.target.value)
    }

    // Tapahtumankäsittelijä synkronoi filter inputille tehdyt muutokset
    const handleFilter = (event) => {
        // Päivitetään tila - event.target.value viittaa inputin arvoon
        setFilter(event.target.value)
    }

    // Henkilön lisääminen tai tietojen muuttaminen
    const handlePerson = () => {
        // Tarkistetaan löytyykö henkilö jo listalta
        if (persons.map(person => person.name).includes(newName)) {
            const updatedPerson = persons.find(p => p.name === newName)
            const changedNumber = { ...updatedPerson, number : newNumber }
            if (window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?')) {
                personService
                    .update(updatedPerson.id, changedNumber)
                    .then(returnedPerson => {
                        setPersons(persons.concat(returnedPerson))
                    })
                    // Ilmoitus
                    .then(message => {
                        setMessage(
                        `Person '${newName}' number changed.`
                        )
                        setTimeout(() => {
                            setMessage(null)
                            // Päivitetään sivu
                            window.location.reload()
                        }, 5000)
                    })
            }
        }
        else {
            // Uuden henkilön lisääminen
            addPerson()
        }
    }

    // Henkilön poistaminen
    const handleRemove = (id) => {
        // Etsitään person taulusta id:tä vastaava tietue
        const person = persons.find(p => p.id === id)
        // Poistetaan id:tä vastaava tietue
        if (window.confirm('Delete ' + person.name + ' ?')) { 
            personService
                .deletePerson(person.id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== id))
                })
                // Ilmoitus
                .then(message => {
                    setMessage(
                      `Person '${person.name}' removed from the server.`
                    )
                    setTimeout(() => {
                      setMessage(null)
                    }, 5000)
                })
                // Virheilmoitus
                .catch(error => {
                    setErrorMessage(
                        'Information of ' + person.name + ' has already been removed from server.'
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                        // Päivitetään sivu
                        window.location.reload()
                    }, 5000)
                })
        } 
    }

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={message} />
            <Error message={errorMessage} />
            <Filter filter={filter} handleFilter={handleFilter}/>
            <h3>Add New</h3>
            <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} handlePerson={handlePerson} />
            <h3>Numbers</h3>
            <Persons namesToShow={namesToShow} handleRemove={handleRemove}/>
        </div>
    )
}

export default App