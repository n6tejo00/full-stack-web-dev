import React from 'react'

const Courses = props => props.courses.map(course =>
    <div key={course.name}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
      <hr />
    </div>
)
  
const Header = props =>
    <h1>{props.name}</h1>
  
const Content = props => props.parts.map(part =>
    <Part key={part.id} part={part} />
)
  
const Part = props =>
    <p>{props.part.name} {props.part.exercises}</p>
  
const Total = props => {
    const total = props.parts.reduce((accumulator, currentValue) => {return accumulator + currentValue.exercises}, 0)
    return(
      <div>
        <b>Total of {total} exercises</b>
      </div>
    )
}

export default Courses