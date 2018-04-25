/**
 * Created by bogdan on 24.03.18.
 */
import app from './app';
import debug from 'debug';

const serverDebug = debug('server');
const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    serverDebug(`Server running at http://localhost:${port}/`);
});



export default server;