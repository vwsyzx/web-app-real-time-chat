const mongoose = require('mongoose');

const Friend = new mongoose.Schema({
    friendId: {type: String, required: true},
    userId: {type: String, required: true},
    userUnique: {type: String, required: true},
    friends: {type: Array, default: []}
})

module.exports = mongoose.model('Friend', Friend)