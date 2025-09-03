import { Request, Response } from "express";
import CartItem from "../models/CartItem";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const createOrUpdateOrder = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const {
			orderId,
			shippingAddress,
			paymentMethod,
			paymentDetails,
			totalAmount,
			deliveryCharge,
		} = req.body;

		const cart = await CartItem.findOne({ user: userId }).populate("items.product");

		if (!cart || cart.items.length === 0) {
			return response(res, 404, "Cart is empty");
		}

		let order = await Order.findOne({ _id: orderId });

		if (!order) {
			order = new Order({
				user: userId,
				items: cart.items,
				totalAmount,
				shippingAddress,
				paymentMethod,
				paymentDetails,
				paymentStatus: paymentDetails ? "complete" : "pending",
			});
			await order.save();
			return response(res, 200, "Order created succesfully.", order);
		}
		order.items = cart.items;
		order.shippingAddress = shippingAddress || order.shippingAddress;
		order.paymentMethod = paymentMethod || order.paymentMethod;
		order.totalAmount = totalAmount || order.totalAmount;
		order.deliveryCharge = deliveryCharge || order.deliveryCharge;
		if (paymentDetails) {
			order.paymentDetails = paymentDetails;
			order.paymentStatus = "complete";
			order.status = "processing";
			await Order.findByIdAndUpdate(orderId, { createdAt: new Date() });
			await CartItem.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
		}

		await order.save();

		return response(res, 200, "Order updated succesfully.", order);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Error, Please try again");
	}
};

export const getUserOrders = async (req: Request, res: Response) => {
	const userId = req.userId;
	try {
		const orders = await Order.find({ user: userId })
			.sort({ createdAt: -1 })
			.populate("user", "name email")
			.populate("shippingAddress")
			.populate({
				path: "items.product",
				model: "Product",
			});

		if (!orders) {
			return response(res, 404, "Orders not found!");
		}

		return response(res, 200, "All Orders fetched succesfully", orders);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	const { orderId } = req.params;

	if (!orderId) {
		return response(res, 200, "Order ID is missing!");
	}

	try {
		const order = await Order.findById(orderId)
			.populate("user", "name email")
			.populate("shippingAddress")
			.populate({
				path: "items.product",
				model: "Product",
			});

		if (!order) {
			return response(res, 404, "Order not found!");
		}

		return response(res, 200, "Order fetched By Id succesfully", order);
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const createPaymentWithRazorpay = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.body;
		const order = await Order.findById(orderId).lean();

		if (!order) {
			return response(res, 404, "Order not found!");
		}

		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_ID as string,
			key_secret: process.env.RAZORPAY_SECRET as string,
		});

		const razorpayOrder = await razorpay.orders.create({
			amount: Math.round(order.totalAmount! * 100),
			currency: "INR",
			receipt: order._id.toString(),
		});

		return response(res, 200, "Razorpay order payment created succesfully.", {
			order: razorpayOrder,
		});
	} catch (err) {
		console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
	}
};

export const handleRazorpayWebHook = async (req: Request, res: Response) => {
	// try {
	// 	const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
	// 	const shasum = crypto.createHmac("shah256", secret);
	// 	shasum.update(JSON.stringify(req.body));
	// 	const digest = shasum.digest("hex");
	// 	if (digest === req.headers["x-razorpay-signature"]) {
	// 		const paymentId = req.body.payload.payment.entity.id;
	// 		const orderId = req.body.payload.payment.entity.order.id;
	// 		await Order.findByIdAndUpdate(
	// 			{
	// 				"paymentDetails.razorpay_order_id": orderId,
	// 			},
	// 			{
	// 				paymentStatus: "complete",
	// 				status: "processing",
	// 				"paymentDetails.razorpay_payment_id": paymentId,
	// 			}
	// 		);
	// 	}
	// } catch (err) {
	// 	console.log(err);
	// 	return response(res, 500, "Internal Server Problem, Please try again.");
	// }
};
