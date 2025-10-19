import { createYoga } from 'graphql-yoga';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

export const yoga = createYoga({
  schema: {
    typeDefs,
    resolvers,
  },
  graphqlEndpoint: '/graphql',
  landingPage: true,
  graphiql: {
    title: 'Weight Tracker GraphQL API',
  },
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:19006', '*'],
    credentials: true,
  },
});
