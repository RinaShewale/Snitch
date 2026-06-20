import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import transporter from "../utils/mailer.js";
import crypto from "crypto";


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, contact, password, role } = req.body;

    if (!fullName || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const user = await User.create({
      fullName,
      email,
      contact,
      password,
      role,
      provider: "local",
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered ✅",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required ❌",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "Use Google login for this account",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password not set ❌",
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login success ✅",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= GOOGLE CALLBACK =================
export const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("https://snitch-fwb7.onrender.com/login?error=oauth_failed");
    }

    const token = generateToken(req.user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("https://snitch-fwb7.onrender.com/");
  } catch (error) {
    return res.redirect("https://snitch-fwb7.onrender.com/login?error=server_error");
  }
};


// ================= PROFILE =================
export const getProfile = (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};


// ================= LOGOUT =================
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logout successful ✅",
  });
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📧 Forgot password request for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `https://snitch-fwb7.onrender.com/reset-password/${token}`;

    console.log("📨 Sending email...");

    const info = await transporter.sendMail({
      from: `"Snitch" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
    <div>
      <h2>Reset Password</h2>
      <p>Click below link:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Valid for 15 minutes</p>
    </div>
  `,
    });
    console.log("✅ Mail sent:", info.messageId);

    return res.json({
      success: true,
      message: "Reset link sent ✅",
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired link ❌",
      });
    }

    user.password = password; // hashed by pre-save hook

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful ✅",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = req.body;

    if (!address?.addressLine1) {
      return res.status(400).json({
        success: false,
        message: "Address required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { addresses: address },
        $set: { selectedAddress: address },
      },
      { new: true }
    );

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};