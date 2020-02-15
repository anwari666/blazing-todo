import { useRouter } from 'next/router'
import Link from 'next/link'
import { ApolloProvider} from '@apollo/react-hooks'
import client from '../config/apollo.js'
import TodolistQuery from '../components/Todolist/Todolist'

export default () => {
    const route = useRouter();
    const { todolist_url } = route.query;
    
    if ( todolist_url ) {
        return (
            <ApolloProvider client={ client }>
                <Link href="/"><a>Go home</a></Link>
                <h2>Todolist.... <code>{ todolist_url }</code>!</h2>
                <TodolistQuery url={ todolist_url } />
            </ApolloProvider>
        )
    } else {
        return <h1> URL LOADING </h1>
    }
}