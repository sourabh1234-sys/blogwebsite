const {Schema , model} = require("mongoose")
const {createHmac , randomBytes} = require("node:crypto")
const { createtoken } = require('../services/auth')
const auth = require('../services/auth');



const userschema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    salt: {
        type : String,
    },
    password : {
        type : String,
        required : true
    },
    profileimage : {
        type : String,
        default:'/images/default.png',
    },
    role: {
        type:String,
        enum : ["USER" , 'ADMIN'],
        default : "USER",
    }
    
} , {timestamps:true});

userschema.pre("save" , function () {
    const user = this;

    if(!user.isModified("password"))  return;
    
    const salt = randomBytes(16).toString('hex');
    const hashpassword = createHmac('sha256' , salt).update(user.password).digest("hex")

    this.salt = salt
    this.password = hashpassword
})

userschema.static('matchpass', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashpassword = user.password;

    const userhashpassword = createHmac('sha256', salt).update(password).digest("hex");
    if (hashpassword !== userhashpassword) {
        throw new Error("Incorrect Password!");
    }

    const token = createtoken(user);
    return token;
});
const User = model('User' , userschema)

module.exports = User

