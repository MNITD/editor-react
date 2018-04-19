/**
 * Created by bogdan on 09.04.18.
 */
import User from '../../db/user/user';

const Mutation = {
    createUser: async (root, args) => {
        const {name, phone} = args;
        return await User.create({name, phone})
            .catch(() => {
                throw new Error('There was a problem adding the information to the database.');
            });
    },
    updateUser: async (root, args) => {
        const {name, phone} = args;
        return await User.findByIdAndUpdate(args.id, {name, phone}, {new: true})
            .catch(() => {
                throw new Error('There was a problem updating the user.');
            });
    },
    deleteUser: async (root, args) => (
        await User.findByIdAndRemove(args.id)
            .catch(() => {
                throw new Error('There was a problem deleting the user.');
            })
    ),
};

export default Mutation;