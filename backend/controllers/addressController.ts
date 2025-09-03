import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpateAddressByUserId = async (req: Request, res: Response) => {
	const userId = req.userId;
	const { addressLine1, addressLine2, city, state, pincode, phoneNumber,addressId } = req.body;

	if (!userId) {
		return response(res, 400, "User not found, Invalid user id");
	}

	if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
		return response(res, 400, "All the fields are required to create a new address");
	}

	try {
		const exisitingAddress = await Address.findById(addressId);
		if (!exisitingAddress) {
			const newAddress = new Address({
				user: userId,
				phoneNumber,
				addressLine1,
				addressLine2,
				city,
				state,
				pincode,
			});

			await newAddress.save();
			await User.findByIdAndUpdate(
				userId,
				{ $push: { addresses: newAddress._id } },
				{ new: true }
			);

			return response(res, 200, "Address created successfully", newAddress);
		}

		exisitingAddress.addressLine1 = addressLine1;
		exisitingAddress.addressLine2 = addressLine2;
		exisitingAddress.phoneNumber = phoneNumber;
		exisitingAddress.city = city;
		exisitingAddress.pincode = pincode;
		exisitingAddress.state = state;

		await exisitingAddress.save();

		return response(res, 200, "Address updated successfully.", exisitingAddress);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const getAddressByUserId = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;

		if (!userId) {
			return response(res, 400, "User not found, Invalid user id");
		}

    const address = await User.findById(userId).populate('addresses').select("-password -verificationToken -resetPasswordToken -resetPasswordExpires");
    if(!address) {
      return response(res,404,"User address not found");
    }

    return response(res,200,"User address fetch succesfully.",address);
	} catch (err) {
    console.log(err);
    return response(res,500,'Internal Server Error, Please try again');
  }
};


