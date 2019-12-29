import { ApolloProvider} from '@apollo/react-hooks'
import client from '../config/apollo.js'
import Todolist from '../components/Todolist'

export default () => {
    
    return (
        <ApolloProvider client={ client }>
            <Todolist />
        </ApolloProvider>
    )
}
