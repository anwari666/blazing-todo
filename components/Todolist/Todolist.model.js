import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

/** The obligatory GQL */
const FETCH_TODOLIST = gql`
  query fetch_todolist ( $todolist_url: String! ) {
    todolist(where: {url : { _eq: $todolist_url }}) {
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

// the obligatory delete GQL
const DELETE_TODO = gql`
mutation delete_todo( $todo_id: uuid! ){
    delete_todo( where: { id: { _eq: $todo_id } }) {
        returning {
            id
            label
            completed   
        }
    }
}`;

const UPDATE_TODO = gql`
    mutation update_todo( $todo_id: uuid!, $completed: Boolean!, $label: String! ){
        update_todo( where: { id: { _eq: $todo_id } }, _set: { completed: $completed, label: $label }) {
            affected_rows
            returning {
                completed
                date_created
                id
                label
                order
                todolist_id
            }
        }
    }`

export {
    FETCH_TODOLIST,
    DELETE_TODO,
    UPDATE_TODO
}