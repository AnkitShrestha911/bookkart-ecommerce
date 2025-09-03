import mongoose, { Document, mongo, Schema } from "mongoose";

export interface Product extends Document {
	title: string;
	images: string[];
	subject: string;
	category: string;
	condition: string;
	classType: string;
	price: number;
	author?: string;
	edition?: string;
	description?: string;
	finalPrice: number;
	shippingCost: string;
	available?: boolean;
	seller: mongoose.Types.ObjectId;
	paymentMode: "UPI" | "Bank Account";
	paymentDetails: {
		upiId?: string;
		bankDetail?: {
			accountNumber: string;
			ifscCode: string;
			bankName: string;
		};
	};
}

const productSchema = new Schema<Product>(
	{
		title: { type: String, required: true },
		subject: {
			type: String,
			required: true,
		},
		classType: {
			type: String,
			required: true,
		},
		condition: {
			type: String,
			required: true,
		},
		images: [{ type: String }],
		price: { type: Number, required: true },
		author: { type: String },
		edition: { type: String },
		description: { type: String },
		finalPrice: { type: Number, required: true },
		category: { type: String, required: true },
		paymentMode: { type: String, enum: ["UPI", "Bank Account"], required: true },
		paymentDetails: {
			upiId: {
				type: String,
			},
			bankDetail: {
				accountNumber: {
					type: String,
				},
				ifscCode: {
					type: String,
				},
				bankName: {
					type: String,
				},
			},
		},
		seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
		shippingCost: { type: String, required: true },
		available: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.model<Product>("Product", productSchema);
