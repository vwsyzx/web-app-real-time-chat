const User = require('../models/User')
const apiError = require('../api-error/api-error')
const bcrypt = require('bcryptjs')
const uuid = require('uuid');
const friendServer = require('./friend-service');
const tokenService = require('./token-service');
const Token = require('../models/Token');
const Friend = require('../models/Friend');
const Chat = require('../models/Chat');
const friendService = require('./friend-service');

class userServ{
    async regis(emile, password){
        const userPret = await User.findOne({emile})
        if(userPret){
            throw apiError.BadRequest('User has already Registered!')
        }
        const hashed = bcrypt.hashSync(password, 6)
        const friendId = uuid.v4()
        const userUnique = uuid.v4()

        const newUser = await User.create({emile, password: hashed, userUnique, friendId, requestsRecieved: [], requestsSent: []})
        const newFriendColl = await Friend.create({userId: newUser._id, userUnique, friendId, friends: []})

        return {
            newUser,
            newFriendColl
        }
    }
    async login(emile, password){
        const userPret = await User.findOne({emile})
        if(!userPret){
            throw apiError.Unauthorized()
        }
        const compare = bcrypt.compareSync(password, userPret.password)

        if(!compare){
            throw apiError.BadRequest('Something went Wrong!')
        }
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
        

        const token = tokenService.generateToken({...userPret})
        await tokenService.saveToken(userPret._id, token.refresh)

        return {
            userPret,
            friends: friend.friends,
            strangers,
            token
        }
    }
    async logout(refreshToken, userUnique, lastUser){
        const delToken = await Token.deleteOne({refreshToken})    
        if(lastUser){
            await friendService.reset(userUnique, lastUser)
        }
        return 'SuccessFuly Deleted!'
    }
    async refresh(refreshToken, userUnique){
        
        const tokenPret = await Token.findOne({refreshToken})

        if(!tokenPret){
            throw apiError.Unauthorized()
        }
        const valid = await tokenService.refreshValidator(refreshToken)

        if(!valid){
            throw apiError.InvalidToken()
        }

        const validResult = valid._doc ? valid._doc : valid

        const userPret = await User.findById({_id: validResult._id})
        const friend = await Friend.findOne({friendId: validResult.friendId})

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
        if(userUnique){
            const lastUser = friend.friends.find(item => item.userUnique === userUnique)
            const chatPret = await Chat.findOne({chatId: lastUser.chatId})

            return {
                userPret,
                friends: friend.friends,
                strangers,
                lastUser,
                chatPret,
                token
            } 
        }
        return {
            userPret,
            friends: friend.friends,
            strangers,
            token
        }
    }
}

module.exports = new userServ()