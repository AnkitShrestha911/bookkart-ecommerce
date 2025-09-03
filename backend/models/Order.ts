import mongoose, { Document, Schema } from "mongoose";
import { IAddress } from "./Address";

export interface IOrderItem extends Document {
	product: mongoose.Types.ObjectId;
	quantity: number;
}

export interface IOrder extends Document {
	_id: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	items: IOrderItem[];
	totalAmount?: number;
	shippingAddress?: mongoose.Types.ObjectId | IAddress;
	deliveryCharge?:number;
	paymentStatus: "pending" | "complete" | "failed";
	paymentMethod: string;
	paymentDetails: {
		razorpay_order_id?: string;
		razorpay_payment_id?: string;
		razorpay_signature?: string;
	};

	status: "processing" | "shipped"  | "delivered" | "cancelled";
}

const orderItemSchema = new Schema<IOrderItem>({
	product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	quantity: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	items: [orderItemSchema],
	shippingAddress: { type: Schema.Types.ObjectId, ref: "Address" },
	paymentStatus: { type: String, enums: ["pending", "complete", "failed"], default: "pending" },
	paymentMethod: { type: String },
	paymentDetails: {
		razorpay_order_id: { type: String },
		razorpay_payment_id: { type: String },
		razorpay_signature: { type: String },
	},
	totalAmount:{type:Number},
	status: {
		type: String,
		enums: ["processing", "shipped", "out-for-delivery", "delivered", "cancelled"],
		default: null,
	},
	deliveryCharge:{type:Number}
},{timestamps:true});

export default mongoose.model<IOrder>('Order',orderSchema);