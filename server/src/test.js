/**
 * Created by bogdan on 05.04.18.
 */
import http from 'http';
import assert from 'assert';

import './index';

const port = process.env.PORT || 8080;

describe('Test Root Router', () => {
    it('should return 200', done => {
        http.get(`http://127.0.0.1:${port}`, res => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});