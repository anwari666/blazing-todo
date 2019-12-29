import { useState } from 'react';
import Todo from './Todo'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const FETCH_TODO = gql`query {
    todolist(where: {url : { _eq: "firstlist"}}) {
      id
      date_created
      date_completed
      title
      url
      todos {
        id
        label
        completed
      }
    }
  }
  `;

export default ({  }) => {
  const { data: { todolist }, loading, error } = useQuery(FETCH_TODO);

  const [todos, setTodos] = useState([{
    label: 'some label',
    completed: false,
    id: 1
  },{
    label: 'second label',
    completed: true,
    id: 2
  },{
    label: 'third label',
    completed: false,
    id: 3
  },]);


  const handleDelete = ( id ) => {
    alert(`delete ${id}?`)
    setTodos( todos.filter( ( todo )=> {
        return todo.id !== id
    } ) )
  }

  const handleComplete = ( id ) => {
    setTodos(
        todos.map( (todo) => {
            return todo.id !== id 
                    ? todo 
                    : { 
                        ...todo, 
                        completed : ! todo.completed 
                      } // return a new todo
        })
    )
  }

  return (
      <>
          { todolist[0].todos.map( (todo, index) => (
            <Todo 
              key={ todo.id }
              handleDelete={ handleDelete }
              handleComplete={ handleComplete }
              {...todo} />
          )) } 
      </>
  )
}

