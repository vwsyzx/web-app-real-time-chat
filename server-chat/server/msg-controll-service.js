const Friend = require("../models/Friend")
const User = require("../models/User")

class msgControll{
    async msgOnline(userUnique, otherFriend, otherOnline){
        const newOtherFriend = otherFriend
        newOtherFriend.friends.map(item => {
            if(item.userUnique === userUnique && item.online && !otherOnline){
                item.unread += 1
            }
        })
        const upd = await Friend.updateOne({userUnique: otherFriend.userUnique}, newOtherFriend)
        const newFriend = await Friend.findOne({userUnique: otherFriend.userUnique})
        const otherPret = await User.findOne({userUnique: otherFriend.userUnique})

        return {
            otherPret, 
            otherFriends: newFriend.friends
        }
    }
}
module.exports = new msgControll()