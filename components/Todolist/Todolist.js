import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_TODOLIST, useDeleteTodo, useUpdateTodo } from './Todolist.model'

/** The actual component */
const Todolist = ( props ) => { 
  const { todos, id, url } = props.todolist

  /**
   * Logic for handling update todo
   */
  const mutation_updateTodo = useUpdateTodo( url )

  function handleComplete( todo ) {
    const { id, completed, label } = todo

    mutation_updateTodo({
        variables : {
            todo_id: id,
            completed: ! completed,
            label
        },
        optimisticResponse : {
            __typename: "Mutation",
            update_todo: {
                __typename: "todo_mutation_response",
                affected_rows: 1,
                returning: [{
                    ...todo,
                    __typename: "todo",
                    completed: !completed
                }]
            }
          },
    })
  }

  function handleRename( todo ) {
    const { id, completed, newLabel, cursorPosition } = todo

    console.log( cursorPosition )

    const cursorEOL     = cursorPosition === newLabel.length
    // this is error because i need to account for the usual `submit` event
    // that is triggerred without any cursor, by clicking a button.
    const currLabel = newLabel.slice(0, cursorPosition)
    const nextLabel = newLabel.slice(cursorPosition, newLabel.length)
    if (nextLabel === "")
      setIndexOfAddTodo( getIndexOfTodo(id) + 1 )
      

    mutation_updateTodo({
        variables : {
            todo_id: id,
            completed,
            label: currLabel
        },
        optimisticResponse : {
            __typename: "Mutation",
            update_todo: {
                __typename: "todo_mutation_response",
                affected_rows: 1,
                returning: [{
                    ...todo,
                    __typename: "todo",
                    label: newLabel,
                }]
            }
          },
    })
  }

  function getIndexOfTodo( id ){
    return listView.findIndex( todo => todo.id === id )
  }

  /**
   * Logic for deleting todo
   */
  const mutation_deleteTodo = useDeleteTodo( url )
  const handleDelete = ( todo_id ) => {
      mutation_deleteTodo( {
          variables : {
              todo_id
          }
      } );
  }

  /* There should be NO TWO <AddTodo /> instances at a time! */
  const currMaximumOrder = todos.reduce( (acc, todo) => Math.max(todo.order, acc), 0 )
  const listView = [...todos].sort( (a, b) => b.order > a.order )
  const AddTodoInstance = <AddTodo 
                todolist_id={ id } 
                todolist_url={ url }
                order={ currMaximumOrder + 1 } />

  const [indexOfAddTodo, setIndexOfAddTodo] = useState(0)

  return (
        <div>
            
            { listView
                .map( (todo, index) => {
                  if (index === indexOfAddTodo) {
                    return (<div key="something"><AddTodo 
                      key="AddTodo"
                      todolist_id={ id } 
                      todolist_url={ url }
                      order={ currMaximumOrder + 1 } />
                    <Todo 
                      key={ todo.id }
                      todolist_url={ url }
                      handleComplete={ handleComplete } 
                      handleRename={ handleRename } 
                      handleDelete={ handleDelete }
                      {...todo} /></div>)
                  } else {
                  return(
                    <Todo 
                      key={ todo.id }
                      todolist_url={ url }
                      handleComplete={ handleComplete } 
                      handleRename={ handleRename } 
                      handleDelete={ handleDelete }
                      {...todo} />
                  )}}) 
              } 
        </div>
    )
}

/**
 * Fetch the thingy. This is as simple as it gets
 */
const TodolistQuery = ( props ) => {
  const { data, loading, error } = useQuery(FETCH_TODOLIST, 
                                      { 
                                        variables: { 
                                          todolist_url:  props.url 
                                        } 
                                      });

  if ( loading ) return (<h1>Loading</h1>);
  if ( error ) return (<h1>ERROR BRUH</h1>);

  const { todolist  } = data;
  const todolistIsEmpty = todolist.length === 0;

  if ( data && todolistIsEmpty ) {
    return <h2>No such todolist here....</h2>
  } else {
    return <Todolist todolist={ todolist[0] } />
  }
}

export default TodolistQuery;
export { Todolist }