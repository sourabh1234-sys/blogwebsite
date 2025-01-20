const {Schema , model} = require("mongoose")

const blogschema = new Schema({
    title : {
        type : String,
        require : true
    },
    body : {
        type : String,
        require : true
    },
    coverphoto : {
        type : String,
        
    },
    createby : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
} , {timestamps : true})

const Blog = model('blog' , blogschema)

module.exports = Blog