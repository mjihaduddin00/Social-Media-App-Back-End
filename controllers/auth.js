const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require("../models/user");

exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});
    if(userExists) return res.status(403).json({
        error: "Email is taken!"
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({message: "Signup successful! Please login."});
};

exports.signin = (req, res) => {
    //Find The User Based On Email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        //If Error Or No User
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signin."
            });
        }
        //If User Is Found Make Sure The Email & Password Match
        //Create Authenticated Method In Model And User Here
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match."
            });
        }
            //Generate A Token With User ID and Secret String
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

            //Persist The Token As 't' In Cookie With Expire Date
            res.cookie("t", token, {expire: new Date() + 9999});
            //Return Response With User And Token To Frontend Client
            const {_id, name, email} = user;
            return res.json({token, user: {_id, email, name}});
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({message: "Signout Successful!"});
};

exports.requireSignin = expressJwt({
    //If The Token Is Valid Then Express-JWT Appends The Verified User's ID
    //In An Auth Key To The Request Object
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
    //userProperty: 'auth'
});