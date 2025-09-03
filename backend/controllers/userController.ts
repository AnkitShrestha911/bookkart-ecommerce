import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const updateUserProfile = async (req: Request, res: Response) => {
	const { userId } = req.params;

	if (!userId) {
		return response(res, 400, "User ID is required");
	}

	try {
		const { name, email, phoneNumber } = req.body;
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ name, email, phoneNumber },
			{ new: true, runValidators: true }
		).select("-password -verificationToken -resetPasswordToken -resetPasswordExpires").lean();

    if(!updateUser) {
      return response(res,404,"User not found");
    }

    return response(res,200,"User profile updated succesfully.",updateUser);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};
