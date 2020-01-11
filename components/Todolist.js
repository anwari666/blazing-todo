import { useState } from 'react'
import Todo from './Todo'
import AddTodo from './AddTodo'
import { gql, ApolloClient } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'

const FETCH_TODO = gql`
  query fetch_todos {
    todolist(where: {url : { _eq: "firstlist"}}) {
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

const handleDelete = ( id ) => {
  alert(`delete ${id}?`)
  /* setTodos( todos.filter( ( todo )=> {
      return todo.id !== id
  } ) ) */
}


const Todolist = ({ todos }) => { 
  const [ label, setLabel ] = useState('');

  const handleComplete = ( id ) => {
    const DELETE_TODO = gql`
      mutation delete_todo($id: String!) {
        delete_todo(where: {id: {_eq: ${id} }}) {
          returning {
            label
            completed
          }
        }
      }
    `

    const [ delete_todo, { data } ] = useMutation( DELETE_TODO )


    /* setTodos(
        todos.map( (todo) => {
            return todo.id !== id 
                    ? todo 
                    : { 
                        ...todo, 
                        completed : ! todo.completed 
                      } // return a new todo
        })
    ) */
  }
  

  const [ addTodo ] = useMutation( ADD_TODO, 
                          { 
                            update: ( cache, { data } ) => {
        
                              // Read existing cache
                              const existingCache = cache.readQuery({
                                query: FETCH_TODO
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
                                      ...existingCache.todolist[0].todos, 
                                      newTodo
                                    ]
                                  }]
                                }
                              })
                            },

                            onCompleted: () => { setLabel(''); console.log( 'todo inserted...') } 
                          });
  
  // the function to update the cace
  
  const onAddTodo = (e) => {
    e.preventDefault();

    if (label === '') {
      alert('label is empty!');
    } else {

      addTodo({variables: { order: 8, todolist_id: "6efb65e3-9567-4d18-a205-aa2c102ccc14", label }});

      // when success,
      // setLabel('');
    }
  }

  const onLabelChange = ( event ) => {
    setLabel( event.target.value );
  }

  return (
        <>
            <AddTodo label={ label } onLabelChange={ onLabelChange } onAddTodo={ onAddTodo } />
            { todos.map( (todo, index) => (
              <Todo 
                key={ todo.id }
                handleDelete={ handleDelete }
                handleComplete={ handleComplete }
                {...todo} />
            )) } 
        </>
    )
}

/**
 * Fetch the thingy. This is as simple as it gets
 */
const TodolistQuery = () => {
  const { data, loading, error } = useQuery(FETCH_TODO);

  if ( loading ) return (<h1>Loading</h1>);
  if ( error ) return (<h1>ERROR BRUH</h1>);

  const { todolist  } = data;
  const todolistIsEmpty = todolist.length === 0;

  if ( todolistIsEmpty ) {
    return <h2>Nuthin here....</h2>
  } else {
    return <Todolist todos={ todolist[0].todos } />
  }
}

export default TodolistQuery;