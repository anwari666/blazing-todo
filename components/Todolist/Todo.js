import { useState } from 'react'


/** The default export from this file */
const Todo = ( props ) => {
    const { label, order, completed, id, handleDelete, handleComplete, handleRename, handleNewTodo } = props

    const [ visualState, setVisualState ] = useState('normal');
    
    
    const [ newLabel, setNewLabel ] = useState( label );
    function handleOnChange(e) {
        setNewLabel( e.target.value );
    }


    let cursorPosition = 0
    // handling keyboard events
    function handleKeyDown(event) {
        // easier-to-remember variable names
        const pressedEscape   = event.keyCode === 27
        const pressedEnter    = event.keyCode === 13
        
        if ( pressedEscape )
            cancelRename()
        if ( pressedEnter ) {
            console.log("enter is pushed!")
            cursorPosition =  event.target.selectionStart
            
            if ( cursorPosition !== newLabel.length ){
                const currLabel = newLabel.slice(0, cursorPosition)
                const nextLabel = newLabel.slice(cursorPosition, newLabel.length)

                setNewLabel( currLabel )
                handleNewTodo(id, nextLabel)

                console.log(`rename WILL be called with: ${ currLabel }`)

                handleSubmit(event)
                // !! important to prevent default, teuing kunaon
                event.preventDefault()
            }
            
            // will call handleSubmit(event) after this manually
        }
    }
    function cancelRename() { setVisualState('normal'); setNewLabel( label )}
    
    function handleSubmit(e) {
        
        // handle rename as usual
        handleRename( { ...props, newLabel } )
        setVisualState('normal')
       
        e.preventDefault()
    }

    function handleFormSubmit(e) {
        cursorPosition = (cursorPosition === 0) ? newLabel.length : cursorPosition

        // console.log("WHEN SUBMIT form: " + cursorPosition )
        // will have to call `handleSubmit()` manually since it doesn't know what to do.
        handleSubmit(e)
        e.preventDefault()
    }

    function handleOnBlur(e) {
        handleSubmit(e)
    }

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
                <input id={ `todo-${id}` } type="text" 
                    value={ newLabel } 
                    onChange={ handleOnChange } 
                    onKeyDown={ handleKeyDown }
                    onBlur={ handleSubmit } /> | 
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