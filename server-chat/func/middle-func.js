const apiError = require("../api-error/api-error");
const errorHandler = require("../error-handler/error-handler");
const middleService = require("../server/middle-service");

class middleFunc{
    async request(req, res){
        try {
            const {access} = req.headers
            if(access){
                if(req.body.emile && req.body.userId && req.body.userUnique){
                    const result = await middleService.request(access, req.body.emile, req.body.userId, req.body.userUnique)
                    return res.status(200).json(result)
                }
                throw apiError.BadRequest('Fill necessaru Fields!')
            }
            throw apiError.Unauthorized()

        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async accept(req, res){
        try {
            const {access} = req.headers
            if(access){
                if(req.body.emile && req.body.userId && req.body.userUnique){
                    const result = await middleService.accept(access, req.body.emile, req.body.userId, req.body.userUnique)                    
                    return res.status(200).json(result)
                }
                throw apiError.BadRequest('Fill necessary Fields!')
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async reject(req, res){
        try {
            const {unique} = req.params
            const {access} = req.headers

            if(access){
                const result = await middleService.reject(access, unique)
                return res.status(200).json(result)
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async mute(req, res){
        try {
            const {unique} = req.params
            const {access} = req.headers

            if(access){
                const result = await middleService.mute(access, unique)
                return res.status(200).json(result)
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async status(req, res){
        try {
            const {unique} = req.params
            const {access} = req.headers

            if(access){
                const result = await middleService.status(access, unique)
                return res.status(200).json(result)
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async select(req, res){
        try {
            const { access } = req.headers
            const { unique } = req.params
            
            if(access){
                const result = await middleService.select(access, unique)
                return res.status(200).json(result)
            }
            throw apiError.BadRequest('Fill necessary Fields')

        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async online(req, res){
        try {
            if(req.body.userUnique && req.body.current){
                const result = await middleService.online(req.body.current, req.body.userUnique, req.body.mood, req.body.lastUser)
                return res.status(200).json(result)
            }
            throw apiError.BadRequest('Fill necessary Fields!')
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
}
module.exports = new middleFunc()