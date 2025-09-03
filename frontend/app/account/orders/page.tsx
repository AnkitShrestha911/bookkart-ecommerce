"use client";
import NoData from "@/app/components/NoData";
import PageLoader from "@/app/components/PageLoader";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Order } from "@/lib/type";
import { useGetUserOrderQuery } from "@/store/api";
import { Calendar, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import OrderDetailDialog from "./orderDetailDialog";
import { Button } from "@/components/ui/button";

const Page = () => {
	const { data: orderData, isLoading } = useGetUserOrderQuery({});
	const [showAllOrder, setShowAllOrder] = useState(false);
	const router = useRouter();

	if (isLoading) {
		return <PageLoader />;
	}

	const orders: Order[] = orderData?.data || [];
	const displayOrder = showAllOrder ? orders : orders.slice(0, 10);

	if (orders.length === 0) {
		return (
			<div className="my-10 max-w-3xl justify-center mx-auto">
				<NoData
					imageUrl="/images/no-book.jpg"
					message="You haven't order any books yet."
					description="Start order your books to reach potential buyers. order your first book now!"
					onClick={() => router.push("/books")}
					buttonText="Order Your First Book"
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl sm:text-4xl font-bold mb-2">My Orders</h1>
				<p className="text-purple-100">View and manage your recent purchases</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
				{displayOrder.map((order) => {
					return (
						order?.status && (
							<Card key={order?._id} className="flex flex-col border shadow-xl border-gray-300">
								<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
									<CardTitle className="text-lg sm:text-xl text-purple-700 flex items-center">
										<ShoppingBag className="h-5 w-5 mr-2" />
										Order #{order?._id.slice(-6)}
									</CardTitle>
									<CardDescription className="flex items-center">
										<Calendar className="h-5 w-5 mr-2" />
										{new Date(order?.createdAt).toLocaleString()}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="space-y-2">
										<p className="font-bold">
											{order?.items
												.map((item) => item?.product?.title)
												.join(", ")}
										</p>
										<div className="text-sm flex gap-2 text-gray-600">
											<span>
												{order?.items.map((item) => (
													<span>
														{item?.product?.subject +
															(item?.product?.author
																? `, (${item?.product?.author})`
																: " ")}
														<br />
													</span>
												))}
											</span>
										</div>
										<p className="text-sm flex items-center tracking-wide">
											<CreditCard className="w-5 h-5 mr-2" />
											Total Price:{" "}
											<span className="text-xs m-1">&#8377;</span>
											{order.totalAmount}
										</p>

										<p className="text-sm flex items-center text-blue-600 tracking-wide">
											<Truck className="w-5 h-5 mr-2" />
											Shipping Cost:{" "}
											<span className="text-xs m-1">&#8377;</span>
											{order?.deliveryCharge}
										</p>

										<div className="flex items-center space-x-2">
											<span className="text-sm">Status:</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-semibold ${
													order?.status === "delivered"
														? "bg-green-400 text-green-800"
														: order?.status === "processing"
														? "bg-yellow-100 text-yellow-800"
														: order?.status === "shipped"
														? "bg-blue-100 text-blue-800"
														: "bg-red-800"
												}`}
											>
												{order?.status?.charAt(0)?.toUpperCase() +
													order?.status?.slice(1)}
											</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="bg-purple-50">
									<OrderDetailDialog order={order} />
								</CardFooter>
							</Card>
						)
					);
				})}
			</div>
			{/* show all order */}
			<div className="flex justify-center">
				<Button
					onClick={() => setShowAllOrder(!showAllOrder)}
					className="bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
				>
					{showAllOrder ? "Show Less" : "View All Orders"}
				</Button>
			</div>
		</div>
	);
};

export default Page;
