import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FETCH_TODO } from './Todolist'

const DELETE_TODO = gql`
mutation delete_todo( $todo_id: uuid! ){
    delete_todo( where: { id: { _eq: $todo_id } }) {
      returning {
        id
        label
        completed   
      }
    }
  }`

export default ({ label, completed, id, children, handleComplete }) => {
    
    const [ mutation_deleteTodo ] = useMutation( DELETE_TODO, 
        { 
          update: ( cache, { data } ) => {
    
            // Read existing cache
            const existingCache = cache.readQuery({
              query: FETCH_TODO
            });
        
            // Tambahkan Todo dari cache. 
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
        // alert(`delete ${id}?`);
        mutation_deleteTodo( {
            variables : {
                todo_id: id
            }
        } );
    }


    return (
    <>
        <div>
            <label className={ completed ? 'completed' : undefined }>
                {label}
            </label> | 
            <button onClick={ () => handleDelete( id ) }> delete </button>
            {/* <button onClick={ () => handleComplete( id ) }> complete </button> */}
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
