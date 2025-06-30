import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import { OTP } from "../models/otp.js";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export function saveUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user == null) {
      res.status(403).json({
        message: "Please login as admin before creating an admin account",
      });
      return;
    }
    if (req.user.role != "admin") {
      res.status(403).json({
        message: "You are not authorized to create an admin account",
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
    phone: req.body.phone,
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.json({
        success: true,
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

        const token = jwt.sign(userData, process.env.JWT_KEY, {
          expiresIn: "48hrs",
        });

        res.json({
          success: true,
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

export async function googleLogin(req, res) {
  const accessToken = req.body.accessToken;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    // console.log(response);
    const user = await User.findOne({
      email: response.data.email,
    });
    if (user == null) {
      const newUser = new User({
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        // role:"user",
        isDisabled: false,
        isEmailVerified: true,
      });
      await newUser.save();
      const userData = {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        role: "user",
        phone: "Not given",
        isDisabled: false,
        isEmailVerified: true,
      };
      const token = jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: "48hrs",
      });

      res.json({
        success: true,
        message: "Login Successful",
        token: token,
        user: userData,
      });
    } else {
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isDisabled: user.isDisabled,
        isEmailVerified: user.isEmailVerified,
      };

      const token = jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: "48hrs",
      });

      res.json({
        success: true,
        message: "Login Successful",
        token: token,
        user: userData,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Google login failed",
    });
  }
}

export function getCurrentUser(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "Please login to get user details",
    });
    return;
  }
  res.json({
    user: req.user,
  });
}

export async function sendOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(Math.random() * 9000 + 1000);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Reset Password",
    text: "Your OTP is " + otp,
  };

  const newOtp = new OTP({
    email: email,
    otp: otp,
  });

  newOtp.save().then(() => {
    console.log("OTP saved successfully");
  });

  transport
    .sendMail(message)
    .then(() => {
      res.json({
        message: "OTP sent successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "OTP not sent",
        error: error.message,
      });
    });
}

export async function changePassword(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;

  try {
    const lastOTPData = await OTP.findOne({
      email: email,
    }).sort({
      createdAt: -1,
    });
    if (lastOTPData == null) {
      res.status(404).json({
        message: "No OTP found for this email",
      });
      return;
    }
    if (lastOTPData.otp != otp) {
      res.status(403).json({
        message: "Invalid OTP",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.updateOne(
      {
        email: email,
      },
      {
        password: hashedPassword,
      }
    );
    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in changing password",
    });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// Block/Unblock user
export async function blockUser(req, res) {
  const { email, isDisabled } = req.body;
  try {
    await User.updateOne({ email }, { isDisabled });
    res.json({
      message: `User ${isDisabled ? "blocked" : "unblocked"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
}


// export async function updateProfile(req, res) {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { firstName, lastName, phone } = req.body;

//   try {
//     const updated = await User.updateOne(
//       { email: req.user.email },
//       { firstName, lastName, phone }
//     );

//     if (updated.modifiedCount === 0) {
//       return res.status(400).json({ message: "No changes made" });
//     }

//     res.json({ message: "Profile updated successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update profile", error: err.message });
//   }
// }
export async function updateProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { firstName, lastName, phone } = req.body;

  try {
    // Validate inputs (optional, add your own validation here)

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      { new: true } // Return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}


export async function changePasswordWithOld(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCorrect = bcrypt.compareSync(oldPassword, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.updateOne({ email: req.user.email }, { password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
}

