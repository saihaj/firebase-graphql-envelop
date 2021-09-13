import { CreateApp } from '@graphql-ez/vercel'
import { ezSchema, gql } from '@graphql-ez/plugin-schema'
import fb from './firebase-plugin'
import admin from 'firebase-admin'
import serviceAccount from './firebase.json'

export const ezApp = CreateApp({
  cors: true,
  ez: {
    plugins: [
      ezSchema({
        schema: {
          typeDefs: gql`
            type Query {
              hello: String!
            }
          `,
          resolvers: {
            Query: {
              hello() {
                return 'Hello World!'
              },
            },
          },
        },
      }),
    ],
  },
  envelop: {
    plugins: [
      fb({
        firebaseApp: admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        }),
      }),
    ],
  },
})
