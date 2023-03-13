const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler ( async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        // 0th->space<- 1th
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlcjIiLCJlbWFpbCI6InVzZXIyQGdtYWlsLmNvbSIsImlkIjoiNjQwZTNiMTY1Yzg0OWVmODg2NTdjZDA4In0sImlhdCI6MTY3ODY1NDQwNSwiZXhwIjoxNjc4NjU0NDY1fQ.lpgtdzdy1Tkuezb6tr-rbf7L36ZjNq82lT3PnIH4Rn4
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("User is not authorized!");
            }

            console.log(decoded);
            req.user = decoded.user;
            next();
        });

        if(!token){
            res.status(401);
            throw  new Error("User is not authorized or token is missing!");
        }
    }
 });

 module.exports = validateToken;