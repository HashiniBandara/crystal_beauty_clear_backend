import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function saveUser(req, res) {

if(req.body.role=="admin"){
  if(req.user==null){
    res.status(403).json({
      message:"Please login as admin before creating an admin account",
    });
    return;
  }
  if(req.user.role!="admin"){
    res.status(403).json({
      message:"You are not authorized to create an admin account",
    });
    return;
  }
}

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    role:req.body.role,
  });

  user
    .save()
    .then(() => {
      res.json({
        message: "User saved successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "User not saved", error: error.message });
    });
  // .catch(()=>{
  //     res.json({
  //        message:"User not saved"
  //     })
  // })
}
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user == null) {
      res.json({
        message: "Invalid email",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const userData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };
        // const token = jwt.sign(userData, process.env.JWT_KEY); or use as below 

        const token = jwt.sign(userData, process.env.JWT_KEY,{
          expiresIn:"48hrs"
        });

        res.json({
          message: "Login Successful",
          token: token,
          user: userData,
        });

        // res.json({
        //     message:"Login successful"
        // })
      } else {
        res.json({
          message: "Invalid password",
        });
      }
    }
  });
}
