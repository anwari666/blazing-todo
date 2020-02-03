import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FETCH_TODO } from './Todolist'

import { useRouter } from 'next/router'

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

/** The default export from this file */
const Todo = ( props ) => {
    const { label, order, completed, id, todolist_url } = props

    // !! grab the todolist url. fu. might be better to keep this on the Todolist component.
    // const route = useRouter();
    // const { todolist_url } = route.query;

    const [ visualState, setVisualState ] = useState('normal');
    
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
                  query: FETCH_TODO,
                  variables: { todolist_url }
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
            
              onCompleted: ( ) => { console.log( `${ label } updated coi...`); },
              onError: ( ) => { console.log( `${ label } updated coi...`); setVisualState('rename'); }
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
                        ...props,
                        __typename: "todo",
                        completed: !completed
                    }]
                }
              },
        })
    }
    

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
                        ...props,
                        __typename: "todo",
                        label: newLabel,
                    }]
                }
              },
        })

        setVisualState('normal');
    }

    

    return (
    <>
        <div className={ `state--${visualState}` }>
            {order}: 
            <form onSubmit={ handleRename } >
                <label 
                    htmlFor={ `todo-${id}` }
                    className={ completed ? 'completed' : undefined } 
                    onClick={ () => { setVisualState('rename') } }>
                        {label}
                </label> |
                <input id={ `todo-${id}` } type="text" value={ newLabel } onChange={ handleOnChange } /> | 
            </form>
            <button onClick={ handleDelete }> X </button>
            <button onClick={ handleComplete }> complete </button>
        </div>

        <style jsx>{`
            form { display: inline; }
            .state--normal input { display: none }
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