import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

/** The obligatory GQL */
const FETCH_TODOLIST = gql`
  query fetch_todolist ( $todolist_url: String! ) {
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


/** The GQL query shite
 *  
 */
const ADD_TODO = gql`
  mutation add_todo( $order: Int!, $todolist_id: uuid!, $label: String! ) {
  insert_todo ( objects: {order: $order, todolist_id: $todolist_id, label: $label } ) {
        returning {
          completed
          date_created
          id
          label
          order
          todolist_id
        }
      }
    }
`

// define AddTodo
const useAddTodo = ( url, options = { onCompleted: () => false} ) => {

  
  const [ mutation_addTodo ] = useMutation( ADD_TODO, 
    { 
      update: ( cache, { data } ) => {

        // Read existing cache
        const existingCache = cache.readQuery({
          query: FETCH_TODOLIST,
          variables: { todolist_url: url }
        });
        
        // Tambahkan Todo baru ke cache. 
        // this following line depends on the shape of the returning data hmmft.
        const newTodo = data.insert_todo.returning[0];
        
        cache.writeQuery({
          query: FETCH_TODOLIST,
          // the shape of this data should match the cache. whyyy....
          data: {
            todolist: [{ 
              ...existingCache.todolist[0], 
              todos: [ 
                newTodo,
                ...existingCache.todolist[0].todos
              ]
            }]
          }
        })
      },
      
      onCompleted: () => { console.log( `todo inserted...`);  options.onCompleted(); } 
    });

    return mutation_addTodo
}
    
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

const useDeleteTodo = ( url ) => {

  const [ mutation_deleteTodo ] = 
    useMutation( DELETE_TODO, { 
      update: ( cache, { data } ) => {

        // Read existing cache
        const existingCache = cache.readQuery({
          query: FETCH_TODOLIST,
          variables: { todolist_url: url }
        });
    
        // Tambahkan Todo dari cache
        const deletedTodo = data.delete_todo.returning[0];
    
        cache.writeQuery({
          query: FETCH_TODOLIST,
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

  return mutation_deleteTodo
}

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


// maybe just export these things?
const useUpdateTodo = ( url ) => {
  const [ mutation_updateTodo ] =   useMutation( UPDATE_TODO , {
      update: ( cache, { data } ) => {

          // Read existing cache
          const existingCache = cache.readQuery({
            query: FETCH_TODOLIST,
            variables: { todolist_url: url }
          });
      
          // Tambahkan Todo dari cache
          const updatedTodo = data.update_todo.returning[0];
      
          const newCache = ({
            query: FETCH_TODOLIST,
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
      
        onCompleted: ( data ) => { console.log( `${ data.update_todo.returning[0].label } updated coi...`); },
        onError: ( error ) => { console.error(error); console.log( `error coi...`); /* setVisualState('rename'); */ }
  });

  return mutation_updateTodo
}

export {
    FETCH_TODOLIST,
    useAddTodo,
    DELETE_TODO,
    useDeleteTodo,
    UPDATE_TODO,
    useUpdateTodo
}