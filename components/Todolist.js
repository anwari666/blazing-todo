import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

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

// the obligatory delete GQL
const DELETE_TODO = gql`
mutation delete_todo( $todo_id: uuid! ){
    delete_todo( where: { id: { _eq: $todo_id } }) {
        returning {
            id
            label
            completed   
        }
    }
}`;

const UPDATE_TODO = gql`
    mutation update_todo( $todo_id: uuid!, $completed: Boolean!, $label: String! ){
        update_todo( where: { id: { _eq: $todo_id } }, _set: { completed: $completed, label: $label }) {
            affected_rows
            returning {
                completed
                date_created
                id
                label
                order
                todolist_id
            }
        }
    }`

/** The actual component */
const Todolist = ({ todos, id, url }) => { 
  const [ label, setLabel ] = useState('')

  const onLabelChange      = ( event ) => { setLabel( event.target.value )  }
  const onAddTodoCompleted = () => { setLabel('') }


  const [ mutation_updateTodo ] = 
  useMutation( UPDATE_TODO , {
      update: ( cache, { data } ) => {

          // Read existing cache
          const existingCache = cache.readQuery({
            query: FETCH_TODO,
            variables: { todolist_url: url }
          });
      
          // Tambahkan Todo dari cache
          const updatedTodo = data.update_todo.returning[0];
      
          const newCache = ({
            query: FETCH_TODO,
            // the shape of this data should match the cache. whyyy....
            data: {
              todolist: [{ 
                ...existingCache.todolist[0], 
                todos: existingCache.todolist[0].todos.map( (todo) => 
                  (todo.id === updatedTodo.id) ? updatedTodo : todo )
              }]
            }
          })

          // console.log( newCache.data.todolist[0])
          cache.writeQuery( newCache )
        },
      
        onCompleted: ( data ) => { console.log( data.update_todo.returning[0]); console.log( `updated coi...`); },
        onError: ( error ) => { console.error(error); console.log( `error coi...`); /* setVisualState('rename'); */ }
  });

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
                    ...todolist_id,
                    __typename: "todo",
                    label: newLabel,
                }]
            }
          },
    })

    
  }

  const [ mutation_deleteTodo ] = 
        useMutation( DELETE_TODO, { 
          update: ( cache, { data } ) => {
    
            // Read existing cache
            const existingCache = cache.readQuery({
              query: FETCH_TODO,
              variables: { todolist_url: url }
            });
        
            // Tambahkan Todo dari cache
            const deletedTodo = data.delete_todo.returning[0];
        
            cache.writeQuery({
              query: FETCH_TODO,
              // the shape of this data should match the cache. whyyy....
              data: {
                todolist: [{ 
                  ...existingCache.todolist[0], 
                  todos: existingCache.todolist[0].todos.filter( (todo) => (todo.id !== deletedTodo.id) )
                }]
              }
            })
          },
    
          onCompleted: () => { console.log( `todo deleted...`); } 
        });

    const handleDelete = ( todo_id ) => {
        mutation_deleteTodo( {
            variables : {
                todo_id
            }
        } );
    }

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
export { FETCH_TODO, UPDATE_TODO, DELETE_TODO, Todolist }