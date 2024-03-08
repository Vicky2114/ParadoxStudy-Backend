const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    static userRegistration = async (req, res) => {
        const { username, email, password, isVerified } = req.body;
        try {
            const user = await User.findOne({ email: email });
            if (user) {
                return res.send({ "status": "failed", "message": "Email already exists" });
            }

            if (username && email && password && isVerified) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                const doc = new User({
                    username: username,
                    email: email,
                    password: hashPassword
                });
                await doc.save();
                res.status(201).send({ "status": "success", "message": "User registered successfully" });
            } else {
                return res.send({ "status": "failed", "message": "All fields are required" });
            }
        } catch (error) {
            console.error(error);
            return res.send({ "status": "failed", "message": "Unable to register" });
        }
    }
    static userLogin = async (req, res) => {
        try {
            const {email, password} = req.body
            if(email && password){
                const user = await User.findOne({email : email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if( (user.email === email) && isMatch){
                        res.status(201).send({"status": "success", "message": "Login Successfully" })
                    }else{
                        res.send({"status": "failed", "message": "Invalid email or password" })
                    }
                }else{
                    res.send({"status": "failed", "message": "You are not registered" })
                }
            }else{
                res.send({"status": "failed", "message": "All fields are required" })
            }
        } catch (error) {
            res.send({"status": "failed", "message": "Unable to Login" })
        }
    }
}

module.exports = UserController;
