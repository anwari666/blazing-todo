import { useState } from 'react'
import { useAddTodo } from './Todolist.model'


/** The Element itself.
 * 
 * @param {*} param0 
 */
const AddTodo = ({ todolist_id, todolist_url, order }) => {

    const [ label, setLabel ] = useState('')
    const onLabelChange       = event => setLabel( event.target.value )
    const onAddTodoCompleted  = () => setLabel('')

    const mutation_addTodo = useAddTodo( todolist_url, { onCompleted: onAddTodoCompleted } )

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