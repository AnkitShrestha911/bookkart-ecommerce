import { Request, Response } from "express";
import Product from "../models/Product";
import { response } from "../utils/responseHandler";
import WishList from "../models/WishList";
import mongoose from "mongoose";

export const addToWishList = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const { productId } = req.body;
		const product = await Product.findById(productId);
		if (!product) {
			return response(res, 404, "Product not found!");
		}

		let wishlist = await WishList.findOne({ user: userId });

		if (!wishlist) {
			wishlist = new WishList({ user: userId, products: [] });
		}

		if (!wishlist.products.includes(productId)) {
			wishlist.products.push(productId);
			await wishlist.save();
		}

		return response(res, 200, "Product added to your wishlist succesfully.", wishlist);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const removeFromWishList = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const { productId } = req.params;
		const wishlist = await WishList.findOne({ user: userId });
		if (!wishlist) {
			return response(res, 404, "Wishlist not found for this user.");
		}

		wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
		await wishlist.save();
		return response(res, 200, "Product removed from wishlist succesfully.", wishlist);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getWishListByUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		console.log(userId);
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return response(res, 400, "Invalid user ID");
		}
		// let wishlist = await WishList.findOne({ user: userId }).populate("products");
		let wishlist = await WishList.findOne({ user: userId });
		if (!wishlist) {
			return response(res, 404, "WishList is empty", { products: [] });
		}

		return response(res, 200, "WishList fetched for this user", wishlist);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getAllWishListByUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		let wishlist = await WishList.findOne({ user: userId }).populate("products");
		if (!wishlist) {
			return response(res, 404, "WishList is empty", { products: [] });
		}

		return response(res, 200, "WishList fetched for this user", wishlist);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const findProductInWishList = async (req: Request, res: Response) => {
	try {
		const userId =  req.userId;
		const { productId } = req.params;
		const product = await Product.findById(productId);
		if (!product) {
			return response(res, 404, "Product not found!");
		}

		let wishlist = await WishList.findOne({ user: userId });
		if (!wishlist?.products?.includes(new mongoose.Types.ObjectId(productId))) {
			return response(res, 404, "Product not exist in wishlist");
		}


		return response(res, 200, "Product exist in wishlist",wishlist);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};
