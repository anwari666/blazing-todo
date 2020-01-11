export default ({ label, completed, id, children, handleDelete, handleComplete }) => {
    
    /* const handleDelete = (id) => {
        alert(`delete ${id}?`);
        const del = gql`mutation {
            delete_todo(where: {id: {_eq: "2d0ecbb0-090f-4487-a648-e12bc6cce0cd"}}) {
              returning {
                label
                completed   
              }
            }
          }`
        handleDelete( id )
    } */


    return (
    <>
        <div>
            <label className={ completed ? 'completed' : undefined }>
                {label}
            </label> | 
            <button onClick={ () => handleDelete( id ) }> delete </button>
            {/* <button onClick={ () => handleComplete( id ) }> complete </button> */}
        </div>

        <style jsx>{`
            .completed {
                text-decoration: line-through;
                color: gray
            }
        `}</style>
    </>
    );
}
