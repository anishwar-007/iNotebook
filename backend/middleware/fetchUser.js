const jwt = require('jsonwebtoken');
const JWT_SECRET = 'anuisasmartassboy';
const fetchUser = (req,res,next) =>{
    // Get the user from jwt token and add it to the req object
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).json({error:"Please authenticate with valid token"});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
         res.status(401).json({error:"Please authenticate with valid token"});
    }
}

module.exports = fetchUser;