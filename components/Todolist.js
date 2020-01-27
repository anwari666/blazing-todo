import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

/** The obligatory GQL */
const FETCH_TODO = gql`
  query fetch_todos ( $todolist_url: String! ) {
    todolist(where: {url : { _eq: $todolist_url }}) {
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


/** The actual component */
const Todolist = ({ todos, id, url }) => { 
  const [ label, setLabel ] = useState('')

  const onLabelChange      = ( event ) => { setLabel( event.target.value )  }
  const onAddTodoCompleted = () => { setLabel('') }

  return (
        <div>
            <AddTodo label={ label } 
                onLabelChange={ onLabelChange } 
                onAddTodoCompleted={ onAddTodoCompleted } 
                todolist_id={ id } 
                todolist_url={ url } />
            { todos.map( (todo, index) => (
              <Todo 
                key={ todo.id }
                {...todo} />
            )) } 
        </div>
    )
}

/**
 * Fetch the thingy. This is as simple as it gets
 */
const TodolistQuery = ( props ) => {
  const { data, loading, error } = useQuery(FETCH_TODO, 
                                      { 
                                        variables: { 
                                          todolist_url:  props.url 
                                        } 
                                      });

  if ( loading ) return (<h1>Loading</h1>);
  if ( error ) return (<h1>ERROR BRUH</h1>);

  const { todolist  } = data;
  const todolistIsEmpty = todolist.length === 0;

  if ( todolistIsEmpty ) {
    return <h2>No such todolist here....</h2>
  } else {
    return <Todolist { ...todolist[0] } />
  }
}

export default TodolistQuery;
export { FETCH_TODO }