import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import { GRAPHQL_URL } from './appconfig'
import { typeDefs, resolvers } from './apollo.resolvers'

const client = new ApolloClient({
    link: new HttpLink({
            uri: GRAPHQL_URL,
            fetch: fetch
    }),
    cache: new InMemoryCache(),
    typeDefs,
    resolvers
})

export default client;