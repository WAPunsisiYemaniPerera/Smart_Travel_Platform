const jwt = require('jsonwebtoken'); // For generating JWT tokens

module.exports = function(req,res,next){
    //get token from header
    const token = req.header('x-auth-token');

    // check if no token and don't allow access
    if(!token){
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
        }

        //if token is there, check if valid
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // If token is correct, add the user details to req object
            req.user = decoded.user;
            next(); //proceed to next middleware or route handler
        } catch (error) {
            res.status(401).json({
                msg: 'Token is not valid'
            });
        }
    }
