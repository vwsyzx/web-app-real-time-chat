const apiError = require("../api-error/api-error");
const User = require("../models/User");
const tokenService = require("./token-service");
const friendService = require('./friend-service');
const Friend = require("../models/Friend");

class middleServ{
    async request(access, emile, userId, userUnique){
        const valid = await tokenService.accessValidator(access)
        
        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid 
        if(validResult.userUnique === userUnique){
            throw apiError.BadRequest('User cant send request you Itself!')
        }
        const userPret = await User.findById({_id: validResult._id})
        const anotherUser = await User.findById({_id: userId})

        if(!userPret || !anotherUser){
            throw apiError.BadRequest('User not Found!')
        }
        const check1 = userPret.requestsSent.find(item => item.userUnique === userUnique)
        const check2 = anotherUser.requestsRecieved.find(item => item.userUnique === userPret.userUnique)
        if(check1 || check2){
            throw apiError.BadRequest('Request has already Sent!')
        }

        userPret.requestsSent.push({
            emile,
            userId,
            userUnique
        })
        anotherUser.requestsRecieved.push({
            emile: userPret.emile,
            userId: userPret._id,
            userUnique: userPret.userUnique
        })
        await userPret.save()
        await anotherUser.save()

        const all = await User.find()
        const users = all.filter(item => item.userUnique !== userPret.userUnique)

        const strangers = []
        users.map(item => {
            const one = friend.friends.find(elem => elem.userUnique === item.userUnique)
            if(!one){
                strangers.push(item)
            }
        })   

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        const friend = await Friend.findOne({friendId: userPret.friendId})

        return {
            userPret,
            friends: friend.friends,
            strangers,
            token
        }
    }
    async accept(access, emile, userId, userUnique){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }

        const validResult = valid._doc ? valid._doc : valid

        const result1 = await friendService.recieved(validResult.userUnique, emile, userId, userUnique)
        const result2 = await friendService.sent(userUnique, validResult.emile, validResult._id, validResult.userUnique, result1.chatId)
        
        const userPret = await User.findById({_id: validResult._id})

        const all = await User.find()
        const users = all.filter(item => item.userUnique !== userPret.userUnique)

        const strangers = []
        users.map(item => {
            const one = result1.baseFriend.friends.find(elem => elem.userUnique === item.userUnique)
            if(!one){
                strangers.push(item)
            }
        })   

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        return {
            userPret,
            friends: result1.baseFriend.friends,
            strangers,
            token
        }
    }
    async reject(access, userUnique){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid

        const userPret = await User.findById({_id: validResult._id})
        const otherUser = await User.findOne({userUnique})
        if(!otherUser){
            throw apiError.BadRequest('User not Found!')
        }
        const filter1 = userPret.requestsRecieved.filter(item => item.userUnique !== userUnique)
        const filter2 = otherUser.requestsSent.filter(item => item.userUnique !== userPret.userUnique)

        userPret.requestsRecieved = filter1
        otherUser.requestsSent = filter2

        await userPret.save()
        await otherUser.save()

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        const friend = await Friend.findOne({friendId: userPret.friendId})

        const all = await User.find()
        const users = all.filter(item => item.userUnique !== userPret.userUnique)

        const strangers = []
        users.map(item => {
            const one = friend.friends.find(elem => elem.userUnique === item.userUnique)
            if(!one){
                strangers.push(item)
            }
        })   

        return {
            userPret,
            friends: friend.friends,
            strangers,
            token
        }
    }
    async mute(access, userUnique){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid 

        const friend = await Friend.findOne({friendId: validResult.friendId})
        const userPret = await User.findById({_id: validResult._id})
        const newFriend = friend

        newFriend.friends.map(item => {
            if(item.userUnique === userUnique){
                item.mute = !item.mute
            }
        })
        const upd = await Friend.updateOne({userId: userPret._id}, newFriend)
        const friend2 = await Friend.findOne({friendId: userPret.friendId})
        const updFriend = friend2.friends.find(item => item.userUnique === userUnique)

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        return {
            friends: friend2.friends,
            selected: updFriend,
            userPret,
            token
        }
    }
    async status(access, userUnique){
        const valid = await tokenService.accessValidator(access)

        if(!valid){
            throw apiError.InvalidToken()
        }
        const validResult = valid._doc ? valid._doc : valid 

        const friend = await Friend.findOne({friendId: validResult.friendId})
        const userPret = await User.findById({_id: validResult._id})
        const newFriend = friend

        newFriend.friends.map(item => {
            if(item.userUnique === userUnique){
                item.status = !item.status
            }
        })
        const upd = await Friend.updateOne({userId: userPret._id}, newFriend)
        const friend2 = await Friend.findOne({friendId: userPret.friendId})
        const updFriend = friend2.friends.find(item => item.userUnique === userUnique)

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        return {
            friends: friend2.friends,
            selected: updFriend,
            userPret,
            token
        }
    }
    async online(current, userUnique, mood, lastUser){
        const userPret = await User.findOne({userUnique: current})
        const friend = await Friend.findOne({friendId: userPret.friendId})
        const otherFriend = await Friend.findOne({userUnique})

        const newFriend = friend

        newFriend.friends.map(item => {
            if(item.userUnique === userUnique){
                item.unread = 0
            }
        })
        const updFriend = await Friend.updateOne({userUnique: current}, newFriend)

        const newOtherFriend = otherFriend

        newOtherFriend.friends.map(item => {
            if(item.userUnique === userPret.userUnique){
                item.online = mood
            }
        })
        const upd = await Friend.updateOne({userUnique}, newOtherFriend)
        const otherPret = await User.findOne({userUnique})
        const otherFriendNew = await Friend.findOne({userUnique})
        const updNewFriend = await Friend.findOne({userUnique: current})

        if(lastUser){
            const lastPret = await Friend.findOne({userUnique: lastUser})
            const lastFriend = lastPret

            lastFriend.friends.map(item => {
                if(item.userUnique === userPret.userUnique){
                    item.online = false
                }
            })
            const updLast = await Friend.updateOne({userUnique: lastUser}, lastFriend)
            const lastUserPret = await User.findOne({userUnique: lastUser})
            const newLastFriend = await Friend.findOne({userUnique: lastUser})
            return {
                userPret,
                friends: updNewFriend.friends,
                otherPret,
                otherFriends: otherFriendNew.friends,
                lastUserPret,
                lastFriends: newLastFriend.friends
            }
        }
        else{
            return {
                userPret,
                friends: updNewFriend.friends,
                otherPret,
                otherFriends: otherFriendNew.friends
            }
        }  
    }
}

module.exports = new middleServ()