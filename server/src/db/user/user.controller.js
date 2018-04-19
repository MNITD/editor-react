/**
 * Created on 05.04.18
 * @file Processes request related to users
 * @author Bogdan Kovalchuk <bogdanleblank@ukr.net>
 * @version 0.1
 */
import express from 'express';
import bodyParser from 'body-parser';
import User from './user';


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Crate new user
 *
 * in body
 * @param {String} name - Name of user
 * @param {String} phone - Phone number of user
 * @return {Object} crated user
 */
router.post('/', (req, res) => {
    User.create({
            name : req.body.name,
            phone: req.body.phone,
        },
         (err, user) => {
            if (err){
                res
                    .status(500)
                    .send('There was a problem adding the information to the database.');
            }
            else
                res
                    .status(200)
                    .send(user);
            return res;
        });
});

/**
 * Get all users from db
 *
 * @return {Array} list of all users
 */
router.get('/',  (req, res) => {
    User.find({}, (err, users) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the users.');
        else
            res
                .status(200)
                .send(users);
        return res;
    });
});

/**
 * Get user by id
 *
 * in request
 * @param {String} id - id of user
 * @return {Object} finding user
 */
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the user.');
        else if (!user)
            res
                .status(404)
                .send('No user found.');
        else
            res
                .status(200)
                .send(user);
        return res;
    });
});

/**
 * Deletes user from db
 *
 * in request
 * @param {String} id - id of user to delete
 */
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err)
            res
                .status(500)
                .send('There was a problem deleting the user.');
        else
            res
                .status(200)
                .send(user);
        return res;
    });
});

/**
 * Updates user in db
 *
 * in request
 * @param {String} id - id of user to update
 *
 * in body
 * @param {String} name - name of user
 * @param {String} phone - phone number of user
 * @return {Object} new updated user
 */
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err)
            res
                .status(500)
                .send('There was a problem updating the user.');
        else
            res
                .status(200)
                .send(user);
        return res;
    });
});

export default router;