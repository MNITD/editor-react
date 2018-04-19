/**
 * Created by bogdan on 07.04.18.
 */
import { exec } from 'child_process';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';

import userController from '../db/user/user.controller';

import schema from '../schema';

const router = express.Router();

router.get('/schema', (req, res) => {
    exec('npm run schema', (err) => {
        if(err) res.status(404).send('File schema.json is not found.');

        const schemaPath = path.join(__dirname, '../../schema.json');
        res.download(schemaPath, (err) => {
            if(err) res.status(404).send('File schema.json is not found.');
        });
    });


});

router.use('/graphql', bodyParser.json(), graphqlExpress({
    schema,
    formatError: err => {
        return err;
    },
}));

router.use('/graphiql', graphiqlExpress({endpointURL: '/v1/graphql'}));
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use('/users', userController);

export default router;