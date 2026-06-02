import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'


export const singup = async (req,res) =>{
    try {
        const {name,email,password} = req.body;
        
        const existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message : "This email is already exists...!!"})
        } 
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 digits..!!"}) 
        }

        const hashedPassword = await bcrypt.hash(password,10) 
        const newUser = await User.create({
            name, password:hashedPassword,email
        })

        const token = await genToken(newUser._id)

        res.cookie("token",token,{
            httpOnly : true,
            maxAge: 7*24*60*60*1000,
            sameSite:'strict',
            secure:false
        })

        return res.status(201).json(newUser)
    } catch (error) {
        return res.status(500).json({message:`singUp error  : ${error}`})       
    }
}


export const login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({message : "This email does not exists...!!"})
        } 
        const isMatch = await bcrypt.compare(password,existingUser.password)

        if(!isMatch){
             return res.status(400).json({message : "Incorrect password..!!"})
        } 

        const token = await genToken(existingUser._id)

        res.cookie("token",token,{
            httpOnly : true,
            maxAge: 7*24*60*60*1000,
            sameSite:'strict',
            secure:false
        })

        return res.status(200).json(existingUser)
    } catch (error) {
        return res.status(500).json({message:`login error :  ${error}`})       
    }
}

export const logOut = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message : "log out successfully.."})
    } catch (error) {
        return res.status(500).json({message : `log out error : ${error}`})
    }
} 