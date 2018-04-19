/**
 * Created by bogdan on 09.04.18.
 */
import User from './user';

const Mutation = `
     type Mutation {
        createUser(name: String!, phone: String!): User!
        updateUser(id: ID!, name: String!, phone: String!): User!
        deleteUser(id: ID!): User!
    }
`;

// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency and we wrap it in a function
// to avoid strings deduplication
export default () => [Mutation, User];