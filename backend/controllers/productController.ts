import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
	try {
		const {
			title,
			subject,
			category,
			condition,
			classType,
			price,
			author,
			edition,
			description,
			finalPrice,
			shippingCost,
			paymentMode,
			paymentDetails,
		} = req.body;
		const sellerId = req.userId;
		const images = req.files as Express.Multer.File[];
		if (!images || images.length === 0) {
			return response(res, 400, "Image is required");
		}

		let parsedPaymentDetails = JSON.parse(paymentDetails);

		if (paymentMode === "UPI" && (!parsedPaymentDetails || !parsedPaymentDetails.upiId)) {
			return response(res, 400, "UPI ID is required for payment");
		}

		if (
			paymentMode === "Bank Account" &&
			(!parsedPaymentDetails ||
				!parsedPaymentDetails.bankDetails ||
				!parsedPaymentDetails.bankDetails.accountNumber ||
				!parsedPaymentDetails.bankDetails.ifscCode ||
				!parsedPaymentDetails.bankDetails.bankName)
		) {
			return response(res, 400, "Bank Account details is required for payment.");
		}

		const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
		const uploadImages = await Promise.all(uploadPromise);
		const imageUrl = uploadImages.map((image) => image.secure_url);

		const newProduct = new Product({
			title,
			subject,
			description,
			category,
			author,
			price,
			condition,
			classType,
			edition,
			finalPrice,
			seller: sellerId,
			paymentMode,
			paymentDetails: parsedPaymentDetails,
			shippingCost,
			images: imageUrl,
		});

		await newProduct.save();

		return response(res, 200, "Product Created Successfully", newProduct);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		console.log("all product api");
		const products = await Product.find()
			.sort({ createdAt: -1 })
			.populate("seller", "name email");
		return response(res, 200, "All Products fetched succesfully", products);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getProductById = async (req: Request, res: Response) => {
	const productId = req.params.id;
	if (!productId) {
		return response(res, 200, "Failed to fetched product, id is missing!");
	}

	try {
		const product = await Product.findById(productId).populate({
			path: "seller",
			select: "name email phoneNumber profilePicture addresses",
			populate: {
				path: "addresses",
				model: "Address",
			},
		});

		if (!product) {
			return response(res, 404, "Product not found!");
		}

		return response(res, 200, "Product fetched succesfully", product);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	const productId = req.params.productId;
	if (!productId) {
		return response(res, 200, "Failed to delete product, id is missing!");
	}

	try {
		// const product = await Product.findByIdAndDelete(productId);
		const product = await Product.findById(productId);

		if (!product) {
			return response(res, 404, "Product not found!");
		}

		product.available = false;
		await product.save();
		return response(res, 200, "Product deleted succesfully");
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getProductBySellerId = async (req: Request, res: Response) => {
	const sellerId = req.params.sellerId;
	if (!sellerId) {
		return response(res, 404, "Seller not found, ID is missing!");
	}

	try {
		const product = await Product.find({ seller: sellerId })
			.sort({ createdAt: -1 })
			.populate("seller", "name email phoneNumber profilePicture addresses");

		if (!product || product.length === 0) {
			return response(res, 200, "Product not found for this seller!", []);
		}

		return response(res, 200, "Product fetched by sellerId succesfully", product);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};
