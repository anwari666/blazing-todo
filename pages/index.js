import { ApolloProvider} from '@apollo/react-hooks'
import client from '../config/apollo.js'
import TodolistQuery from '../components/Todolist'

export default () => {
    
    return (
        <ApolloProvider client={ client }>
            <TodolistQuery />
        </ApolloProvider>
    )
}
