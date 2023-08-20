const apiError = require("../api-error/api-error");
const Chat = require("../models/Chat");
const User = require("../models/User");
const tokenService = require("./token-service");
const uuid = require('uuid');
const Friend = require("../models/Friend");
const msgControllService = require("./msg-controll-service");

class topServ{
    async getChat(access, chatId){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid

        const chatPret = await Chat.findOne({chatId})
        const userPret = await User.findById({_id: validResult._id})
        const friend = await Friend.findOne({friendId: userPret.friendId})

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        return {
            chatPret,
            userPret,
            friends: friend.friends,
            token
        }
    }

    async sendMsg(access, chatId, what){
        const valid = await tokenService.accessValidator(access)
        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid
        const chatPret = await Chat.findOne({chatId})
        const user = await User.findById({_id: validResult._id})
        
        const userFriend = await Friend.findOne({userUnique: user.userUnique})
        
        const otherUser = userFriend.friends.find(item => item.chatId === chatId)
        const otherFriend = await Friend.findOne({userUnique: otherUser.userUnique})
        
        
        chatPret.messages.push({what, from: user._id, msgId: uuid.v4()})
        await chatPret.save()
        
        
        const result = await msgControllService.msgOnline(user.userUnique, otherFriend, otherUser.online)
        const token = tokenService.generateToken({...user})
        await tokenService.saveToken(user._id, token.refresh)

        return {
            otherPret: result.otherPret,
            otherFriends: result.otherFriends,
            otherUserOnline: otherUser.online,
            chatPret,
            token
        }
    }
    async deleteMsg(access, chatId, msgId){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }

        const validResult = valid._doc ? valid._doc : valid

        const chatPret = await Chat.findOne({chatId})
        const user = await User.findById({_id: validResult._id})

        const filt = chatPret.messages.filter(item => item.msgId !== msgId)

        chatPret.messages = filt
        await chatPret.save()

        const token = tokenService.generateToken({...user})
        await tokenService.saveToken(user._id, token.refresh)

        return {
            chatPret,
            token
        }
    }
}

module.exports = new topServ()