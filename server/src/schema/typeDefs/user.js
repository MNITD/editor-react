/**
 * Created by bogdan on 09.04.18.
 */
const User = `
 type User {
        id: ID!
        name: String!
        phone: String!
    }
`;
// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency and we wrap it in a function
// to avoid strings deduplication
export default () => [User];