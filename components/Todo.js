import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FETCH_TODO, UPDATE_TODO } from './Todolist'


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



/** The default export from this file */
const Todo = ( props ) => {
    const { label, order, completed, id, todolist_url, handleComplete, handleRename } = props

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


    const handleOnChange = (e) => {
        setNewLabel( e.target.value );
    }

    const [ newLabel, setNewLabel ] = useState( label );



    return (
    <>
        <div className={ `state--${visualState}` }>
            {order}: 
            <form onSubmit={ (e) => {e.preventDefault();handleRename( {...props, newLabel} );setVisualState('normal');} } >
                <label 
                    htmlFor={ `todo-${id}` }
                    className={ completed ? 'completed' : undefined } 
                    onClick={ () => { setVisualState('rename') } }>
                        {label}
                </label> |
                <input id={ `todo-${id}` } type="text" value={ newLabel } onChange={ handleOnChange } /> | 
            </form>
            <button onClick={ handleDelete }> X </button>
            <button data-testid={ `complete-${id}` } onClick={ (e) => {handleComplete( props )} }> finish </button>
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

export { UPDATE_TODO }