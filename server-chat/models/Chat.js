const mongoose = require('mongoose');

const Chat = new mongoose.Schema({
    chatId: {type: String, required: true},
    messages: {type: Array, default: []}
})
module.exports = mongoose.model('Chat', Chat)