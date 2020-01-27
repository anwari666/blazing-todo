import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FETCH_TODO } from './Todolist'


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

/** The Element itself.
 * 
 * @param {*} param0 
 */
const AddTodo = ({ label, onLabelChange, onAddTodoCompleted, todolist_id, todolist_url }) => {

    // define AddTodo
    const [ mutation_addTodo ] = useMutation( ADD_TODO, 
        { 
          update: ( cache, { data } ) => {
    
            // Read existing cache
            const existingCache = cache.readQuery({
              query: FETCH_TODO,
              variables: { todolist_url }
            });
        
            // Tambahkan Todo baru ke cache. 
            // this following line depends on the shape of the returning data hmmft.
            const newTodo = data.insert_todo.returning[0];
        
            cache.writeQuery({
              query: FETCH_TODO,
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
    
          onCompleted: () => { console.log( `${ label } inserted...`);  onAddTodoCompleted(); } 
        });
    

    // the function to update the cache
    const onAddTodo = (e) => {
        e.preventDefault();

        if (label === '') {
            alert('label is empty!');
        } else {
            mutation_addTodo({ variables: { 
                        order: 8, 
                        todolist_id, 
                        label 
                    }
                });
        }
    }

    return (<form onSubmit={ onAddTodo }>
            <input 
                  type="text" 
                  placeholder="add your todo" 
                  id="add_todo"
                  value={ label }
                  onChange = { onLabelChange }
                  />
             <button type="submit">
                 submit coi
                 </button>
            </form>)
}

export default AddTodo;