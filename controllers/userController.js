const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler ( async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    
    //this will provide the info whether a user with same email
    // exists ot not
    const userAvailable = await User.findOne({ email });

    if(userAvailable){
        res.status(400);
        throw new Error("User already registred!");
    }

    //we will use hash function to convert roww password into encrypted password
    // before storing that into our database
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ",hashedPassword)
    
    const user = await User.create({
        username,
        email,
        password : hashedPassword,
    });

    console.log(`User registered ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }
    else{
        re.status(400);
        throw new Error("User data is not valid!");
    }
    res.status(200).json({message : "Register the user"});
});

//@desc login user
//@route POST /api/users/login
//@access private
const loginUser = asyncHandler ( async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    
    // comapring password with Hashed password
    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
          }, 
           process.env.ACCESS_TOKEN_SECRET,
           { expiresIn: "100m" },
          );
        res.status(200).json({ accessToken });
    }
    else{
        res.status(401);
        throw new Error("Invalid credentials! Email or password is not valid!");
    }
    res.status(200).json({message : "Login user"});
});


//@desc current user information
//@route GET api/users/current
//@access private

const currentUser = asyncHandler ( async (req, res) => {
console.log("current user info...");
    // res.status(200).json({message : "Current user info"});
    res.status(200).json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};


