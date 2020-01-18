import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { gql, ApolloClient } from 'apollo-boost'
import { useQuery, useApolloClient } from '@apollo/react-hooks'

const FETCH_TODO = gql`
  query fetch_todos {
    todolist(where: {url : { _eq: "firstlist"}}) {
      id
      date_created
      date_completed
      title
      url
      todos {
        completed
        date_created
        id
        label
        order
        todolist_id
      }
    }
  }
  `;

const handleDelete = ( id ) => {
  alert(`delete ${id}?`)
  /* setTodos( todos.filter( ( todo )=> {
      return todo.id !== id
  } ) ) */
}


const Todolist = ({ todos }) => { 
  const [ label, setLabel ] = useState('');

  const handleComplete = ( id ) => {
    const DELETE_TODO = gql`
      mutation delete_todo($id: String!) {
        delete_todo(where: {id: {_eq: ${id} }}) {
          returning {
            label
            completed
          }
        }
      }
    `

    const [ delete_todo, { data } ] = useMutation( DELETE_TODO )


    /* setTodos(
        todos.map( (todo) => {
            return todo.id !== id 
                    ? todo 
                    : { 
                        ...todo, 
                        completed : ! todo.completed 
                      } // return a new todo
        })
    ) */
  }

  const onLabelChange = ( event ) => {
    setLabel( event.target.value );
  }

  

  return (
        <>
            <AddTodo label={ label } onLabelChange={ onLabelChange } onAddTodoCompleted={ () => { setLabel('') } } />
            { todos.map( (todo, index) => (
              <Todo 
                key={ todo.id }
                handleDelete={ handleDelete }
                handleComplete={ handleComplete }
                {...todo} />
            )) } 
        </>
    )
}

/**
 * Fetch the thingy. This is as simple as it gets
 */
const TodolistQuery = () => {
  const { data, loading, error } = useQuery(FETCH_TODO);

  if ( loading ) return (<h1>Loading</h1>);
  if ( error ) return (<h1>ERROR BRUH</h1>);

  const { todolist  } = data;
  const todolistIsEmpty = todolist.length === 0;

  if ( todolistIsEmpty ) {
    return <h2>Nuthin here....</h2>
  } else {
    return <Todolist todos={ todolist[0].todos } />
  }
}

export default TodolistQuery;
export { FETCH_TODO }