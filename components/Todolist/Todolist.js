import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_TODOLIST, useDeleteTodo, useUpdateTodo } from './Todolist.model'

/** The actual component */
const Todolist = ( props ) => { 
  const { todos, id, url } = props.todolist
  const [ label, setLabel ] = useState('')

  const onLabelChange      = ( event ) => { setLabel( event.target.value )  }

  const onAddTodoCompleted = () => { setLabel('') }

  /**
   * Logic for handling update todo
   */
  const mutation_updateTodo = useUpdateTodo( url )

  const handleComplete = ( todo ) => {
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

  const handleRename = ( todo ) => {
    const { id, completed, newLabel } = todo  

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
  const todosInView = [...todos].sort( (a, b) => b.order > a.order )  

  return (
        <div>
            <AddTodo label={ label } 
                onLabelChange={ onLabelChange } 
                onAddTodoCompleted={ onAddTodoCompleted } 
                todolist_id={ id } 
                todolist_url={ url }
                order={ currMaximumOrder + 1 } />
            { todosInView
                .map( (todo, index) => (
                <Todo 
                  key={ todo.id }
                  todolist_url={ url }
                  handleComplete={ handleComplete } 
                  handleRename={ handleRename } 
                  handleDelete={ handleDelete } 
                  {...todo} />
              )) } 
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