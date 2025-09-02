import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";



//Route for user login
const loginUser = async (req, res) => {

}

//Route for user registration
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        //checking user already exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        //validating user already exists or not 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        //hashing user password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating user in database
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });
        return res.json({ success: true, message: "User registered successfully" })

    } catch (error) {
        return res.json({ success: false, message: "Internal server error" })
    }


}

//Route for admin login
const adminLogin = async (req, res) => {

}

export { loginUser, registerUser, adminLogin };

