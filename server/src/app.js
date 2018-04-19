/**
 * Created by bogdan on 31.03.18.
 */
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import db from './db/db'; // connect to mongo hosting
import v1 from './api/v1';

const app = express();

app.use(helmet());
app.use(express.static(path.join(__dirname+'/../public')));

app.use('/v1', v1);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/../public/index.html'));
});


export default app;