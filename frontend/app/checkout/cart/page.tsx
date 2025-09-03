"use client";

import CartItems from "@/app/components/CartItems";
import CheckoutAddress from "@/app/components/CheckoutAddress";
import NoData from "@/app/components/NoData";
import PageLoader from "@/app/components/PageLoader";
import PriceDetails from "@/app/components/PriceDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Address, CartItem } from "@/lib/type";
import {
	useAddToWishListMutation,
	useCreateOrderMutation,
	useCreateRazorpayPaymentMutation,
	useFindProductInWishListQuery,
	useGetCartByUserIdQuery,
	useGetOrderByIdQuery,
	useGetWishListByUserIdQuery,
	useRemoveFromCartMutation,
	useRemoveFromWishListMutation,
} from "@/store/api";
import { clearCart, setCart } from "@/store/slice/cartSlice";
import { resetCheckout, setCheckoutStep, setOrderId } from "@/store/slice/checkoutSlice";
import { logout, openLoginDialog } from "@/store/slice/userSlice";
import { addToWishList, removeFromWishList, setWishList } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

declare global {
	interface Window {
		Razorpay: any;
	}
}

const Page = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.user);
	const { orderId, step } = useSelector((state: RootState) => state.checkout);

	const [showAddressDialog, setShowAddressDialog] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const {
		data: cartData,
		isLoading: isCartLoading,
		refetch,
	} = useGetCartByUserIdQuery(user?._id);
	const [removeCartMutation] = useRemoveFromCartMutation();
	const [addToWishlistMutation] = useAddToWishListMutation();
	const [removeFromWishListMutation] = useRemoveFromWishListMutation();
	const wishlist = useSelector((state: RootState) => state.wishlist.items);
	const [wishlistProductId, setWihslistProductId] = useState<string>("");
	const { data } = useFindProductInWishListQuery(wishlistProductId);
	const { data: wishlistData } = useGetWishListByUserIdQuery(user?._id);

	const cart = useSelector((state: RootState) => state.cart);

	const cartItemCount = useSelector((state: RootState) =>
		state.cart.items.reduce((accu, curr) => accu + curr.quantity, 0)
	);
	const [createOrderMutation] = useCreateOrderMutation();
	const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(orderId || "");
	const [createRazorpayMutation] = useCreateRazorpayPaymentMutation();
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

	const totalAmount = cart?.items?.reduce(
		(accu, item) => accu + item.product?.finalPrice * item?.quantity,
		0
	);
	const totalOriginalAmount = cart.items.reduce(
		(accu, item) => accu + item.product?.price * item?.quantity,
		0
	);
	const totalDiscount = totalOriginalAmount - totalAmount;
	const shippingCharges = cart?.items.map((item) =>
		item?.product?.shippingCost === "free" ? 0 : parseInt(item?.product?.shippingCost)
	);
	const maximumShippingCharge = Math.max(0, ...shippingCharges);
	const finalAmount = totalOriginalAmount + maximumShippingCharge - totalDiscount;

	useEffect(() => {
		if (orderData && orderData.shippingAddress) {
			setSelectedAddress(orderData.shippingAddress);
		}
	}, [orderData]);

	useEffect(() => {
		if (step === "address" && !selectedAddress) {
			setShowAddressDialog(true);
		}
	}, [step, selectedAddress]);

	useEffect(() => {
		if (cartData?.success && cartData?.data) {
			dispatch(setCart(cartData.data));
		}
	}, [cartData, dispatch]);

	useEffect(() => {
		if (wishlistData?.success && wishlistData?.data) {
			dispatch(setWishList([wishlistData.data]));
		}
	}, [wishlistData]);

	useEffect(() => {
		if (data?.success) {
			const isProductExistInWishlist = wishlist.some((item) =>
				item.products?.includes(wishlistProductId)
			);

			if (!isProductExistInWishlist) {
				dispatch(addToWishList(data.data));
			}
		}
	}, [data]);

	async function removeCartItem(productId: string) {
		try {
			const result = await removeCartMutation(productId).unwrap();
			if (result.success) {
				dispatch(setCart(result.data));
				if (step === "address" || step === "payment") {
					dispatch(setCheckoutStep("cart"));
				}
				toast.success("Product removed from cart successfully");
			}
		} catch (e: any) {
			toast.error(e?.data?.messagge || "Failed to remove from cart");
		}
	}

	async function handleAddToWishList(productId: string) {
		setWihslistProductId(productId);
		const isProductExistInWishlist = wishlist.some((item) =>
			item.products?.includes(productId)
		);
		try {
			if (isProductExistInWishlist) {
				const result = await removeFromWishListMutation(productId).unwrap();
				if (result.success) {
					dispatch(removeFromWishList(productId));
					toast.success(result.message || "Removed From WishList");
				} else {
					throw new Error(result.message || "Failed to remove from wishlist");
				}
			} else {
				const result = await addToWishlistMutation(productId).unwrap();
				if (result.success) {
					dispatch(addToWishList(result.data));
					toast.success(result.message || "Added to wishlist successfully.");
				} else {
					throw new Error(result.message || "Failed to add in wishlist");
				}
			}
		} catch (e: any) {
			if (e.status === 401) {
				dispatch(logout());
				dispatch(openLoginDialog());
			}
		}
	}

	async function handleCheckoutProcess() {
		try {
			const response = await refetch();
			if (response?.data?.success) {
				const updatedResponseCart = response?.data?.data;
				const isNotAvailableProductExist = updatedResponseCart.items.some(
					(item: CartItem) => item.product.available === false
				);

				dispatch(setCart(updatedResponseCart));

				if (isNotAvailableProductExist) {
					toast.error("Please remove Not Available product from cart to checkout.");
					return;
				}

				if (step === "cart") {
					try {
						const result = await createOrderMutation({
							updates: {
								totalAmount: finalAmount,
								orderId,
							},
						}).unwrap();
						if (result.success) {
							toast.success("Order created successfully");
							dispatch(setOrderId(result?.data?._id));
							dispatch(setCheckoutStep("address"));
						} else {
							throw new Error(result.message);
						}
					} catch (e) {
						toast.error("Failed to create order");
					}
				} else if (step === "address") {
					if (selectedAddress) {
						dispatch(setCheckoutStep("payment"));
					} else {
						setShowAddressDialog(true);
					}
				} else if (step === "payment") {
					handlePayment();
				}
			}
		} catch (e: any) {
			toast.error(e?.data?.message || "Failed to proceed this order");
		}
	}
	async function handleSelectAddress(address: Address) {
		setSelectedAddress(address);
		setShowAddressDialog(false);
		if (orderId) {
			try {
				await createOrderMutation({
					updates: { orderId, shippingAddress: address },
				}).unwrap();
				toast.success("Address updated successfully");
			} catch (e) {
				toast.error("Failed to update address");
			}
		}
	}

	async function handlePayment() {
		if (!orderId) {
			toast.error("No order found, please try again");
			return;
		}

		setIsProcessing(true);
		try {
			const { data, error } = await createRazorpayMutation(orderId);
			if (error) {
				throw new Error("Failed to create razorpay order");
			}

			const razorpayOrder = data.data.order;
			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
				amount: razorpayOrder.amount, // Amount in paise
				currency: "INR",
				name: "Book Kart",
				description: "Book Purchase",
				order_id: razorpayOrder.id,
				handler: async function (response: any) {
					try {
						const result = await createOrderMutation({
							updates: {
								orderId,
								deliveryCharge: maximumShippingCharge,
								paymentDetails: {
									razorpay_order_id: response.razorpay_order_id,
									razorpay_payment_id: response.razorpay_payment_id,
									razorpay_signature: response.razorpay_signature,
								},
							},
						}).unwrap();

						if (result.success) {
							dispatch(clearCart());
							dispatch(resetCheckout());
							toast.success("Payment succesfull");
							router.push(`/checkout/payment-success?orderId=${orderId}`);
						} else {
							throw new Error(result.message);
						}
					} catch (err: any) {
						toast.error(err?.data?.message || "failed to update order:");
					}
				},

				prefill: {
					name: orderData?.data?.user?.name,
					email: orderData?.data?.user?.email,
					contact: orderData?.data?.user?.phoneNumber,
				},
				theme: {
					color: "#3399cc",
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (err: any) {
			toast.error(err?.data?.message || "Payment error:  ");
		} finally {
			setIsProcessing(false);
		}
	}

	if (!user) {
		return (
			<NoData
				message="Please log in to access your cart."
				description="You need to be logged in to view your cart and checkout."
				buttonText="Login"
				imageUrl="/images/login.jpg"
				onClick={() => dispatch(openLoginDialog())}
			/>
		);
	}

	if (cart.items.length === 0) {
		return (
			<NoData
				message="Your cart is empty."
				description="Looks like you haven't added any items yet. 
        Explore our collection and find something you love!"
				buttonText="Browse Books"
				imageUrl="/images/cart.webp"
				onClick={() => router.push("/books")}
			/>
		);
	}

	if (isCartLoading || isOrderLoading) {
		return <PageLoader />;
	}

	return (
		<>
			<Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

			<div className="min-h-screen bg-white">
				<div className="bg-gray-100 px-6 py-4 mb-8">
					<div className="container mx-auto flex items-center">
						<ShoppingCart className="w-6 h-6 mr-2 text-gray-700" />
						<span className="text-lg font-semibold text-gray-800">
							{cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your cart
						</span>
					</div>
				</div>

				<div className="container mx-auto px-4 max-w-6xl">
					<div className="mb-8">
						<div className="flex justify-center items-center gap-4">
							<div className="flex items-center gap-2">
								<div
									className={`rounded-full p-3 ${
										step === "cart"
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-700"
									}`}
								>
									<ShoppingCart className="w-6 h-6 " />
								</div>
								<span className="font-medium hidden md:inline">Cart</span>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-500" />

							<div className="flex items-center gap-2">
								<div
									className={`rounded-full p-3 ${
										step === "address"
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-700"
									}`}
								>
									<MapPin className="w-6 h-6 " />
								</div>
								<span className="font-medium hidden md:inline">Address</span>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-500" />

							<div className="flex items-center gap-2">
								<div
									className={`rounded-full p-3 ${
										step === "payment"
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-700"
									}`}
								>
									<CreditCard className="w-6 h-6 " />
								</div>
								<span className="font-medium hidden md:inline">Payment</span>
							</div>
						</div>
					</div>

					{/* Cart */}
					<div className="grid gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<Card className="shadow-lg">
								<CardHeader>
									<CardTitle className="text-2xl">Order Summary</CardTitle>
									<CardDescription>Review your items</CardDescription>
								</CardHeader>
								<CardContent>
									<CartItems
										items={cart?.items}
										onRemoveItem={removeCartItem}
										onToggleWishList={handleAddToWishList}
										wishlist={wishlist}
									/>
								</CardContent>
							</Card>
						</div>
						<div>
							<PriceDetails
								totalOriginalAmount={totalOriginalAmount}
								totalAmount={finalAmount}
								shippingCharge={maximumShippingCharge}
								totalDiscount={totalDiscount}
								itemCount={cart.items.length}
								isProcessing={isProcessing}
								step={step}
								onProceed={handleCheckoutProcess}
								onBack={() =>
									dispatch(
										setCheckoutStep(step === "address" ? "cart" : "address")
									)
								}
							/>

							{selectedAddress && (
								<Card className="shadow-lg">
									<CardHeader>
										<CardTitle className="">Delivery Address</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-1">
											<p>{selectedAddress?.state}</p>
											{selectedAddress?.addressLine2 && (
												<p>{selectedAddress.addressLine2}</p>
											)}

											<p>
												{selectedAddress?.city},{selectedAddress?.state},
												{selectedAddress?.phoneNumber}
											</p>
											<p>Phone: {selectedAddress?.phoneNumber}</p>
										</div>
										<Button
											className="mt-4 cursor-pointer border-2 shadow-md hover:bg-amber-200 bg-amber-300"
											variant="outline"
											onClick={() => setShowAddressDialog(true)}
										>
											<MapPin className="w-4 h-4 mr-2" />
											Change Address
										</Button>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
					<Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Select or Add Delivery Address</DialogTitle>
							</DialogHeader>
							<CheckoutAddress
								onAddressSelect={handleSelectAddress}
								selectAddressId={selectedAddress?._id}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</>
	);
};

export default Page;
