const { User, Thought } = require('../models');

const thoughtController = {
    // get all thoughts
    findAllThoughts(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // get thought by id
    findThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found.' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },
    // add a thought
    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    // add a reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate( { _id: params.thoughtId }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found.' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },
    // delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
            if (!deletedThought) {
                res.status(404).json({ message: 'No thought found.' });
                return;
            }
            res.json(deletedThought);
        })
        .catch(err => res.status(500).json(err));
    },
    // delete a reaction from a thought
    deleteReaction({ params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(500).json(err));
    }
}

module.exports = thoughtController;