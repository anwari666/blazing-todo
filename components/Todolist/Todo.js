import { useState } from 'react'


/** The default export from this file */
const Todo = ( props ) => {
    const { label, order, completed, id, handleDelete, handleComplete, handleRename } = props

    const [ visualState, setVisualState ] = useState('normal');
    
    
    const [ newLabel, setNewLabel ] = useState( label );
    const handleOnChange = (e) => {
        setNewLabel( e.target.value );
    }

    // handling keyboard events
    const handleKeyDown = (event) => {
        // in case of ESCAPE key is clicked
        if (event.keyCode === 27)
            cancelRename()
    }
    const cancelRename = () => { setVisualState('normal'); setNewLabel( label )}

    const handleSubmit = (e) => {e.preventDefault();handleRename( {...props, newLabel} );setVisualState('normal');}

    return (
    <>
        <div className={ `state--${visualState}` }>
            {order}: 
            <form onSubmit={ handleSubmit } >
                <label 
                    htmlFor={ `todo-${id}` }
                    className={ completed ? 'completed' : undefined } 
                    onClick={ () => { setVisualState('rename') } }>
                        {label}
                </label> |
                <input id={ `todo-${id}` } type="text" value={ newLabel } onChange={ handleOnChange } onKeyDown={ handleKeyDown } /> | 
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