module.exports = function(req, res, err){
    try {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    } catch (error) {
        res.status(500).json('SERVER ERROR')
    }
}