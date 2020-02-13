import { gql } from 'apollo-boost'
import { FETCH_TODOLIST } from '../components/Todolist/Todolist.model'

const typeDefs = gql`
    extend type Mutation {
        updateTodo(todolist_id: ID!, newTodo: todo!) : [ID!]!
    }
`

const resolvers = {
    Mutation : {
        updateTodo: (_, { todolist_id, newTodo }, { cache }) => {
            const queryResult = cache.readQuery({
                query: FETCH_TODOLIST
            })


            if ( queryResult ) {
                const todolist = queryResult.todolist[0]
                

                // I'm pretty sure I can optimise this part. 
                // Nop. Turned out this is fine and i just need optimisticResponse: https://www.apollographql.com/docs/react/performance/optimistic-ui/
                const data = {
                    todolist: [{
                        ...todolist,
                        todos: todolist.todos.map( (todo) => ( todo.id === newTodo.id ? newTodo : todo) )
                    }]
                }

                cache.writeQuery({
                    query: FETCH_TODOLIST, 
                    data
                })

                return newTodo
            }

            return [];
        }
    }
}

export { typeDefs, resolvers }