import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import { sendResetPasswordLinkToEmail, sendVerificationEmail } from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password, agreeTerms } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			return response(res, 400, "User already exists");
		}

		const verificationToken = crypto.randomBytes(20).toString("hex");
		const newUser = new User({ name, email, password, agreeTerms, verificationToken });
		await newUser.save();
		await sendVerificationEmail(newUser.email, verificationToken);

		return response(
			res,
			200,
			"User successfully registered, Please check your email box to verify your account"
		);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const verifyEmail = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({ verificationToken: token });
		if (!user) {
			return response(res, 400, "Invalid or expired verification token");
		}

		if (user.isVerified) {
			return response(res, 200, "alreadyVerified");
		}

		user.isVerified = true;
		user.verificationToken = undefined;

		const accessToken = generateToken(user);
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 1000,
		});

		await user.save();
		return response(
			res,
			200,
			"Your email is verified succesfully, Now you can use our services"
		);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return response(res, 401, "Invalid Credential");
		}

		if (!user.isVerified) {
			return response(
				res,
				400,
				"Please verify your email before login in, Please check your email box to verify"
			);
		}

		const accessToken = generateToken(user);
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 1000,
		});

		return response(res, 200, "User login succesfully.", {
			user: { name: user.name, email: user.email },
		});
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return response(res, 400, "No Account found with this email address");
		}

		const resetPasswordToken = crypto.randomBytes(20).toString("hex");
		user.resetPasswordToken = resetPasswordToken;
		user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
		await user.save();

		await sendResetPasswordLinkToEmail(user.email, resetPasswordToken);

		return response(res, 200, "Password reset link has been sent to your email address");
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;
		const { newPassword } = req.body;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			return response(res, 400, "Invalid or expired verification token");
		}

		user.password = newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		return response(
			res,
			200,
			"Your password has been reset succesfully, now you can login with your new password"
		);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("accessToken", {
			httpOnly: true,
		});

		return response(res, 200, "Logout succesfully.");
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const checkUserAuth = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId).select(
			"-password -resetPasswordToken -resetPasswordExpires -verificationToken"
		);

		if (!user) {
			return response(res, 403, "User not found");
		}

		return response(res, 200, "User authenticated Successfully", user);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const checkUserIsLogin = async (req: Request, res: Response) => {
	const token = req.cookies.accessToken;

	if (!token) {
		return response(res, 401, "User is not authenticatd, no token is missing");
	}

	try {
		const decodeToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
		if (!decodeToken || !decodeToken.userId) {
			return response(res, 401, "User is not authorized, user not found");
		}

		return response(res, 200, "User logged in ");
	} catch (err) {
		return response(res, 401, "Not authorized user or Invalid or expired token");
	}
};
