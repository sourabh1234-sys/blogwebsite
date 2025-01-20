const jwt = require("jsonwebtoken")
const secret = 'sourabhhere'

function createtoken(user) {
    const payload = {
        id : user._id,
        email : user.email,
        profileimage : user.profileimage,
        role : user.role
    }

    const token = jwt.sign(payload , secret)
    return token
    
}

function tokenvaild(token) {

    const payload = jwt.verify(token , secret)
    return payload
    
}

module.exports = {
    createtoken,
    tokenvaild,
}