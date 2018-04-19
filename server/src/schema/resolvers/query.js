/**
 * Created by bogdan on 09.04.18.
 */
import User from '../../db/user/user';

const Query = {
    user: async (root, args) => (
        await User.findById(args.id)
            .catch(() => {
                throw new Error('There was a problem finding the user.');
            })
    ),
    users: async () => (
        await User.find({})
            .catch(() => {
                throw new Error('There was a problem finding the users.');
            })
    ),
};

export default Query;