import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FETCH_TODO } from './Todolist'

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
        update_todo( where: { id: { _eq: $todo_id}}, _set: { completed: $completed, label: $label }) {
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

const UPDATE_TODO_ALT = gql`
    mutation updateTodo ($todolist_id: uuid!, $newTodo: todo!) {
        updateTodo(todolist_id: $todolist_id, newTodo: $newTodo) @client
    }
`

/** The default export from this file */
const Todo = ( todo ) => {
    const { label, order, completed, id } = todo

    const [ visualState, setVisualState ] = useState('');
    
    const [ mutation_deleteTodo ] = 
        useMutation( DELETE_TODO, { 
          update: ( cache, { data } ) => {
    
            // Read existing cache
            const existingCache = cache.readQuery({
              query: FETCH_TODO
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
    
          onCompleted: () => { console.log( `${ label } deleted...`); } 
        });

    const handleDelete = ( ) => {
        mutation_deleteTodo( {
            variables : {
                todo_id: id
            }
        } );
    }

    const [ mutation_updateTodo ] = 
        useMutation( UPDATE_TODO , {
            update: ( cache, { data } ) => {
    
                // Read existing cache
                const existingCache = cache.readQuery({
                  query: FETCH_TODO
                });
            
                // Tambahkan Todo dari cache
                const updatedTodo = data.update_todo.returning[0];
            
                cache.writeQuery({
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
              },
            
              onCompleted: ( ) => { console.log( `${ label } updated coi...`); setVisualState('') }
        });

    const handleComplete = ( ) => {
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
                        __typename: "todo",
                        completed: !completed,
                        date_created: todo.date_created,
                        id: id,
                        label: label,
                        order: todo.order,
                        todolist_id: todo.todolist_id,
                    }]
                }
              },
        })
    }

    const [handleCompleteAlt_mutation, {loading, error} ] = useMutation( UPDATE_TODO_ALT, {
        variables: {
            todolist_id: "TEUING",
            newTodo: { ...todo, completed: !completed }
        }
    })
    

    const handleOnChange = (e) => {
        setNewLabel( e.target.value );
    }

    const [ newLabel, setNewLabel ] = useState( label );

    const handleRename = ( e ) => {
        e.preventDefault();

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
                        __typename: "todo",
                        completed: completed,
                        date_created: todo.date_created,
                        id: id,
                        label: newLabel,
                        order: todo.order,
                        todolist_id: todo.todolist_id,
                    }]
                }
              },
        })
    }

    

    return (
    <>
        <div className={ visualState !== '' ? `state--${visualState}` : 'state--normal' }>
            <label 
                className={ completed ? 'completed' : undefined } 
                onClick={ () => { setVisualState('rename') } }>
                    {order}: {label} | 
            </label> 
            <form onSubmit={ handleRename } >
                <input type="text" value={ newLabel } onChange={ handleOnChange } /> | 
            </form>
            <button onClick={ handleDelete }> X </button>
            <button onClick={ handleComplete }> complete </button>
        </div>

        <style jsx>{`
            form { display: inline; }
            .state--normal form { display: none }
            .state--rename label { display: none }
            .completed {
                text-decoration: line-through;
                color: gray
            }
        `}</style>
    </>
    );
}

export default Todo