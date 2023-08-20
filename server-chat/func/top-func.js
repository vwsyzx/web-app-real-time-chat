const apiError = require("../api-error/api-error");
const errorHandler = require("../error-handler/error-handler");
const topService = require("../server/top-service");

class topFunc{
    async getChat(req, res){
        try {
            const {access} = req.headers
            const {chatId} = req.params
            if(access){
                const result = await topService.getChat(access, chatId)
                return res.status(200).json(result)
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async sendMsg(req, res){
        try {
            const { chatId } = req.params
            const {access} = req.headers
            if(access){
                if(req.body.what){
                    const result = await topService.sendMsg(access, chatId, req.body.what)
                    return res.status(200).json(result)
                }
                throw apiError.BadRequest('Fill necessary Fields!')
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
    async deleteMsg(req, res){
        try {
            const {chatId, msgId} = req.params
            const {access} = req.headers

            if(access){
                const result = await topService.deleteMsg(access, chatId, msgId)
                return res.status(200).json(result)
            }
            throw apiError.Unauthorized()
        } catch (error) {
            errorHandler(req, res, error)
        }
    }
}

module.exports = new topFunc()