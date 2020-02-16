import React from 'react'
import { useAddTodo } from './Todolist.model'


/** The Element itself.
 * 
 * @param {*} param0 
 */
const AddTodo = ({ label, onLabelChange, onAddTodoCompleted, todolist_id, todolist_url, order }) => {

    const mutation_addTodo = useAddTodo( todolist_url, { onCompleted: onAddTodoCompleted } )

    // the function to update the cache
    const onAddTodo = (e) => {
        e.preventDefault();

        if (label === '') {
            alert('label kosong coi!');
        } else {
            mutation_addTodo({ variables: { order, todolist_id, label }} )
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