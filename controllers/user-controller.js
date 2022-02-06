const { User } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v',
            options: { sort: { 'createdAt': -1 } }
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
    },
    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v',
            options: { sort: { createdAt: -1 } }
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found.'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // create user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
    },
    // update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(500).json({ message: 'No user found.' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // add a friend to user's friend list
    addFriend({ params }, res) {
        User.findOne({ _id: params.friendId })
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // delete friend from user's friend list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found.' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    }
}

module.exports = userController;