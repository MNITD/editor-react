/**
 * Created by bogdan on 05.04.18.
 */
// import http from 'http';
import request from 'request';
import assert from 'assert';
import logger from '../../utils/logger';

const port = process.env.PORT || 8080;

describe('Test User Controller (base)', () => {
    it('get/v1/users, should return 200', done => {
        request.get(`http://127.0.0.1:${port}/v1/users`)
            .on('response', res => {
                assert.equal(200, res.statusCode);
                done();
            })
            .on('error', err => {
                assert.equal(200, res.statusCode);
                done();
            });
    });

    it('post/v1/users, should return 200', done => {
        const expectedUser = {name: 'TestName', phone: '+38038738273'};
        const body = {json: expectedUser};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {name, phone} = res.body;
                assert.equal(200, res.statusCode);
                assert.deepEqual(expectedUser, {name, phone});
                done();
            });
    });

    it('put/v1/users/:id, should return 200', done => {
        const body = {json: {name: 'TestName', phone: '+38038738273'}};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {_id} = res.body;
                const body = {json: {name: 'Name', phone: '+38038738273'}};

                request.put(
                    `http://127.0.0.1:${port}/v1/users/${_id}`,
                    body,
                    (err, res) => {
                        // logger('test: put/v1/users/:id', res.body);
                        assert.equal(200, res.statusCode);
                        done();
                    });
            });
    });

    it('delete/v1/users/:id, should return 200', done => {
        const body = {json: {name: 'TestName', phone: '+38038738273'}};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {_id} = res.body;
                request.delete(
                    `http://127.0.0.1:${port}/v1/users/${_id}`,
                    (err, res) => {
                        assert.equal(200, res.statusCode);
                        done();
                    });
            });

    });
});

describe('Test User Controller (middle)', () => {
    it('post/v1/users, should return new User', done => {
        const expectedUser = {name: 'TestName', phone: '+38038738273'};
        const body = {json: expectedUser};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {name, phone} = res.body;
                assert.deepEqual(expectedUser, {name, phone});
                done();
            });
    });

    it('put/v1/users/:id, should return updated User', done => {
        const body = {json: {name: 'TestName', phone: '+38038738273'}};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {_id} = res.body;
                const expectedUser = {name: 'Name', phone: '+38038738273'};
                const body = {json:expectedUser};

                request.put(
                    `http://127.0.0.1:${port}/v1/users/${_id}`,
                    body,
                    (err, res) => {
                        const {name, phone} = res.body;
                        assert.deepEqual(expectedUser, {name, phone});
                        done();
                    });
            });
    });

    it('delete/v1/users/:id, should return deleted User', done => {
        const expectedUser = {name: 'TestName', phone: '+38038738273'};
        const body = {json: expectedUser};
        request.post(
            `http://127.0.0.1:${port}/v1/users`,
            body,
            (err, res) => {
                const {_id} = res.body;
                request.delete(
                    `http://127.0.0.1:${port}/v1/users/${_id}`,
                    (err, res) => {
                        const {name, phone} =  JSON.parse(res.body);
                        assert.deepEqual(expectedUser, {name, phone});
                        done();
                    });
            });

    });
});