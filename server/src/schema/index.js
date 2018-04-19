/**
 * Created by bogdan on 09.04.18.
 */
import {makeExecutableSchema} from 'graphql-tools';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default makeExecutableSchema({typeDefs, resolvers});
