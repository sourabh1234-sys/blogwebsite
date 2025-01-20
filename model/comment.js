const {Schema , model} = require("mongoose")

const commentschema = new Schema({
    content : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true
    },
    blogid : {
        type : Schema.Types.ObjectId,
        ref : "blog"
    },
    createby : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
} , {timestamps : true})

const Comment = model('comment' , commentschema)

module.exports = Comment