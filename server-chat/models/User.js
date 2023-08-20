const mongoose = require('mongoose')

const User = new mongoose.Schema({
    emile: {type: String, required: true},
    password: {type: String, required: true},
    userUnique: {type: String, required: true},
    friendId: {type: String, required: true},
    requestsRecieved: {type: Array, default: []},
    requestsSent: {type: Array, default: []}
})

module.exports = mongoose.model('User', User)