import { useState } from 'react'


/** The default export from this file */
const Todo = ( props ) => {
    const { label, order, completed, id, handleDelete, handleComplete, handleRename } = props

    const [ visualState, setVisualState ] = useState('normal');
    
    
    const [ newLabel, setNewLabel ] = useState( label );
    const handleOnChange = (e) => {
        setNewLabel( e.target.value );
    }

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
            <button onClick={ () => {handleDelete(id)} }> X </button>
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