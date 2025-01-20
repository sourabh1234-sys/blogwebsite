const {tokenvaild} = require('../services/auth')

  
function checkauthenticationcookie(cookie) {
    return (req, res, next) => {
        const cookievalue = req.cookies[cookie];
        if (!cookievalue) return next();

        try {
            const payload = tokenvaild(cookievalue);
            req.user = payload;  
        } catch (error) {
            console.log(error);
        }

        return next();
    }
}


function Checkpermission(cookie){
    return (req , res , next) => {
        const cookievalue = req.cookies[cookie]

        if(!cookievalue){
            res.send(`<script>alert('You cannot access this page without logging in or signing up.');</script>`);
            return;
        }
        next();
    }
}
   
module.exports = {
    checkauthenticationcookie,
    Checkpermission
}