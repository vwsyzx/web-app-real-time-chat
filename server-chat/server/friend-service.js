const User = require("../models/User");
const uuid = require('uuid')
const Chat = require('../models/Chat')
const Friend = require('../models/Friend');
const apiError = require("../api-error/api-error");

class friendServ{
    async recieved(userUnique, emile, userId, anotherUserUnique){

        const userPret = await User.findOne({userUnique})

        const is = userPret.requestsRecieved.find(item => item.userUnique === anotherUserUnique)
        if(!is){
            throw apiError.BadRequest('Something went Wrong!')
        }
        const request = userPret.requestsRecieved.filter(item => item.userUnique !== anotherUserUnique)
        userPret.requestsRecieved = request

        const baseFriend = await Friend.findOne({userUnique})
        if(!baseFriend){
            throw apiError.Unauthorized()   
        }
        
        const chatId = uuid.v4() 
        baseFriend.friends.push({
            emile, 
            userId, 
            userUnique: anotherUserUnique, 
            chatId, 
            mute: false,
            status: false,
            online: false,
            unread: 0
        })
        const newChat = await Chat.create({chatId, messages: []})

        await baseFriend.save()
        await userPret.save()

        return {
            userPret,
            baseFriend,
            chatId
        }
    }
    async sent(userUnique, emile, userId, anotherUserUnique, chatId){
        const userPret = await User.findOne({userUnique})

        const is = userPret.requestsSent.find(item => item.userUnique === anotherUserUnique)
        if(!is){
            throw apiError.BadRequest('Something went Wrong!')
        }
        const newRequestsSent = userPret.requestsSent.filter(item => item.userUnique !== anotherUserUnique)
        userPret.requestsSent = newRequestsSent

        const baseFriend = await Friend.findOne({userUnique})
        
        if(!baseFriend){
            throw apiError.Unauthorized()
        }

        baseFriend.friends.push({
            emile,
            userId,
            userUnique: anotherUserUnique,
            chatId,
            mute: false,
            status: false,
            online: false,
            unread: 0
        })
        await baseFriend.save()
        await userPret.save()

        return {
            userPret,
            baseFriend
        }
    }
    async reset(userUnique, lastUser){
        const friend = await Friend.findOne({userUnique: lastUser})
        const newFriend = friend
        newFriend.friends.map(item => {
            if(item.userUnique === userUnique){
                item.online = false
            }
        })
        const upd = await Friend.updateOne({userUnique: lastUser}, newFriend)
    }
}

module.exports = new friendServ()