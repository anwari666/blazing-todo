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
    const { id, completed, newLabel } = todo

    console.log(`rename is called with: ${ newLabel }`)
    
    mutation_updateTodo({
        variables : {
            todo_id: id,
            completed,
            label: newLabel
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

  
  function handleNewTodo(todo_id, label){
    setLabel( label )
    setIndexOfAddTodo( getIndexOfTodo( todo_id ) + 1 )
  }

  function getIndexOfTodo( id ){
    return listView.findIndex( todo => todo.id === id )
  }

  function removeAddTodo(){
    setIndexOfAddTodo( -1 )
  }

  /**
   * Logic for deleting todo
   */
  const mutation_deleteTodo = useDeleteTodo( url )
  function handleDelete( todo_id ) {
      mutation_deleteTodo( {
          variables : {
              todo_id
          },
          optimisticResponse: {
            "delete_todo":{"returning":[{"id":todo_id,"label":"label","completed":false,"__typename":"todo"}],"__typename":"todo_mutation_response"}
          }
      } );
  }

  /* There should be NO TWO <AddTodo /> instances at a time! */
  const currMaximumOrder = todos.reduce( (acc, todo) => Math.max(todo.order, acc), 0 )
  const listView = [...todos].sort( (a, b) => b.order > a.order )
  

  const [ label, setLabel ] = useState('')
  const onLabelChange       = event => setLabel( event.target.value )
  const onAddTodoCompleted  = () => setLabel('')
  
  // !! Warning: Can't perform a React state update on an unmounted component. 
  // This is a no-op, but it indicates a memory leak in your application. 
  // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  const AddTodoJSX = <AddTodo 
                todolist_id={ id } 
                todolist_url={ url }
                order={ currMaximumOrder + 1 }
                removeAddTodo={ removeAddTodo }
                label={ label }
                onLabelChange={ onLabelChange }
                onAddTodoCompleted={ onAddTodoCompleted } />

  const [indexOfAddTodo, setIndexOfAddTodo] = useState(0)

  return (
        <div>
            
            { listView
                .map( (todo, index) => {
                  
                  const TodoJSX = <Todo key={ todo.id }
                      todolist_url={ url }
                      handleComplete={ handleComplete } 
                      handleRename={ handleRename } 
                      handleDelete={ handleDelete }
                      handleNewTodo={ handleNewTodo }
                      {...todo} />

                  if (index === indexOfAddTodo) {                   
                    return  <div key={ `withAddTodo-${ index }` } > 
                              { AddTodoJSX }
                              { TodoJSX } 
                            </div>
                  } else 
                    return TodoJSX                 
                }) 
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