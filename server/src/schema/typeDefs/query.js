/**
 * Created by bogdan on 09.04.18.
 */
import User from './user';

const Query = `
type Query {
        user(id: ID!): User!
        users: [User!]!
    }
`;

export default () => [Query, User];