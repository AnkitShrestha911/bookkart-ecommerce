import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "@/lib/type";
import { CheckCircle, Eye, Package, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OrderDetailDialogProps {
	order: Order;
}

const StatusSteps = ({
	title,
	icon,
	isCompleted,
	isActive,
}: {
	title: string;
	icon: React.ReactNode;
	isCompleted: boolean;
	isActive: boolean;
}) => {
	return (
		<div
			className={`flex flex-col items-center ${
				isCompleted && isActive
					? "text-red-500"
					: isCompleted
					? "text-green-500"
					: isActive
					? "text-blue-500"
					: "text-gray-500"
			}`}
		>
			<div
				className={`rounded-full p-2 ${
					isCompleted ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100"
				}`}
			>
				{icon}
			</div>
			<span className="text-sm mt-1 font-semibold">{title}</span>
		</div>
	);
};

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ order }) => {
	const getStatusIndex = (Status: string) => {
		const statuses = ["processing", "shipped", "delivered", "cancelled"];
		return statuses.indexOf(Status);
	};

	const statusIndex = getStatusIndex(order?.status);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="cursor-pointer border shadow-sm hover:shadow-lg hover:bg-orange-300"
				>
					<Eye className="w-4 h-4 mr-2" />
					View Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[600px] max-h-[80vh] overflow-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-purple-700">
						Order Details
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-purple-800 mb-2">Order Status</h3>
						<div className="flex justify-between items-center">
							<StatusSteps
								title="processing"
								icon={<Package className="h-5 w-5" />}
								isCompleted={statusIndex > 0}
								isActive={statusIndex === 0}
							/>
							<div
								className={`flex-1 h-1 ${
									statusIndex > 0 ? "bg-green-500" : "bg-gray-300"
								}`}
							></div>

							<StatusSteps
								title="shipped"
								icon={<Truck className="h-5 w-5" />}
								isCompleted={statusIndex > 1}
								isActive={statusIndex === 1}
							/>
							{order?.status !== "cancelled" && (
								<div
									className={`flex-1 h-1 ${
										statusIndex > 1 ? "bg-green-500" : "bg-gray-300"
									}`}
								></div>
							)}

							{order?.status === "cancelled" ? (
								<>
									<div className="h-1 flex-1 bg-red-500"></div>
									<StatusSteps
										title="cancelled"
										icon={<XCircle className="h-5 w-5" />}
										isCompleted={true}
										isActive={true}
									/>
								</>
							) : (
								<>
									<StatusSteps
										title="delivered"
										icon={<CheckCircle className="h-5 w-5" />}
										isCompleted={statusIndex > 2}
										isActive={statusIndex === 2}
									/>
								</>
							)}
						</div>
					</div>
					<div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-blue-800 mb-2">Items:</h3>
						<div className="space-y-4">
							{order?.items?.map((item) => {
								return (
									<div className="space-y-4">
										<Link href={`/books/${item?.product?._id}`}>
											<div
												key={item._id}
												className="flex items-start space-x-4"
											>
												<Image
													src={item?.product?.images?.[0]}
													alt={item?.product?.title}
													width={120}
													height={120}
													className="rounded-md object-contain"
												/>
												<div>
													<p className="font-medium">
														{item?.product?.title}
														<span className="text-sm">
															{item?.product?.author
																? `, (${item.product.author})`
																: ""}
														</span>
													</p>

													<div className="flex gap-2">
														<p className="font-medium text-xs">
															Quantity: {item?.quantity}
														</p>
														<p className="font-medium text-xs">
															Price: {item?.product?.finalPrice}
														</p>
													</div>
												</div>
											</div>
										</Link>
									</div>
								);
							})}
						</div>
					</div>
					{/* Address */}
					<div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-green-800 mb-2">
							Shipping Address
						</h3>
						<p>{order.shippingAddress.addressLine1}</p>
						<p>
							{order.shippingAddress.city},{order.shippingAddress.state},
							{order.shippingAddress.pincode}
						</p>
					</div>

					{/* Payment details */}
					<div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-green-800 mb-2">
							Payment Details
						</h3>
						<p>
							<span className="font-semibold">Order Id:</span> #{order?._id}
						</p>
						<p>
							<span className="font-semibold">Payment Id:</span>{" "}
							{order?.paymentDetails?.razorpay_payment_id}
						</p>
						<p>
							<span className="font-semibold">Total Amount:</span>{" "}
							<span className="text-xs">&#8377;</span>
							{order?.totalAmount}
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default OrderDetailDialog;
