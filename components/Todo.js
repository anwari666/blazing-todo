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
    mutation update_todo( $todo_id: uuid!, $completed: Boolean! ){
        update_todo( where: { id: { _eq: $todo_id}}, _set: { completed: $completed }) {
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

/** The default export from my todo. */
export default ({ label, order, completed, id }) => {
    
    const [ mutation_deleteTodo ] = useMutation( DELETE_TODO, 
        { 
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

    const handleDelete = (id) => {
        mutation_deleteTodo( {
            variables : {
                todo_id: id
            }
        } );
    }

    const [ mutation_updateTodo ] = useMutation( UPDATE_TODO, 
        {
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
        
              onCompleted: () => { console.log( `${ label } updated coi...`); }
        });

    const handleComplete = ( id, completed ) => {
        mutation_updateTodo({
            variables : {
                todo_id: id,
                completed: ! completed
            }
        })
    }

    return (
    <>
        <div>
            <label className={ completed ? 'completed' : undefined }>
                {order}: {label}
            </label> | 
            <button onClick={ () => handleDelete( id ) }> delete </button>
            <button onClick={ () => handleComplete( id, completed ) }> complete </button>
        </div>

        <style jsx>{`
            .completed {
                text-decoration: line-through;
                color: gray
            }
        `}</style>
    </>
    );
}
