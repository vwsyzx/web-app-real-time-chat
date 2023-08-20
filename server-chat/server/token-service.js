const jwt = require('jsonwebtoken')
const Token = require('../models/Token')

class tokenServ{
    generateToken(payload){
        return {
            access: jwt.sign(payload, 'ACCESS_SECRET_KEY', {expiresIn: '15m'}),
            refresh: jwt.sign(payload, 'REFRESH_SECRET_KEY', {expiresIn: '15m'}) 
        }
    }

    async accessValidator(access){
        try {
            const valid = jwt.verify(access, 'ACCESS_SECRET_KEY')

            return valid
        } catch (error) {
            return false
        }
    }
    async refreshValidator(refresh){
        try {
            const valid = jwt.verify(refresh, 'REFRESH_SECRET_KEY')

            return valid
        } catch (error) {
            return false
        }
    }

    async saveToken(userId, refreshToken){
        const userPret = await Token.findOne({userId})
        if(userPret){
            userPret.refreshToken = refreshToken
            return await userPret.save()
        }
        const newToken = await Token.create({userId, refreshToken})
    }
}

module.exports = new tokenServ()