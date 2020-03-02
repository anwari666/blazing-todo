import { useState } from 'react'
import { useAddTodo } from './Todolist.model'


/** The Element itself.
 * 
 * @param {*} param0 
 */
const AddTodo = ({ todolist_id, todolist_url, order, removeAddTodo, label, onLabelChange, onAddTodoCompleted }) => {

    

    // !! is this onAddTodoCompleted necessary?
    const mutation_addTodo = useAddTodo( todolist_url, { onCompleted: () => false } )

    // the function to update the cache
    const onAddTodo = (e) => {
        e.preventDefault();

        if (label === '') {
            alert('label kosong coi!');
        } else {
            mutation_addTodo({ 
                variables: { order, todolist_id, label },
                optimisticResponse: {
                    "insert_todo":{"returning" : [{"completed":false,"date_created":"2020-02-16T07:38:20.016548","id":"TEMPORARY","label":label,"order":order,"todolist_id":todolist_id,"__typename":"todo"}], "__typename" : "todo_mutation_response"}
                }
            } )
            onAddTodoCompleted()
        }
    }

    function handleKeyDown(event) {
        // easier-to-remember variable names
        const pressedEscape   = event.keyCode === 27
        // const pressedEnter    = event.keyCode === 13
        
        if ( pressedEscape )
            removeAddTodo()
    }

    return (<form onSubmit={ onAddTodo }>
            <input 
                  type="text" 
                  placeholder="add your todo" 
                  id="add_todo"
                  value={ label }
                  onChange = { onLabelChange }
                  onKeyDown = { handleKeyDown }
                  autoFocus
                  />
             <button type="submit">
                 submit coi
                 </button>
            </form>)
}

export default AddTodo;