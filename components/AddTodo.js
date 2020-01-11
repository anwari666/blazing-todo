import React from 'react'



const AddTodo = ({ label, onAddTodo, onLabelChange }) => {
    return (<form onSubmit={ onAddTodo }><input 
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