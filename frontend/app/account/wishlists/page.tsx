"use client";

import NoData from "@/app/components/NoData";
import PageLoader from "@/app/components/PageLoader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BookDetails } from "@/lib/type";
import {
	useAddToCartMutation,
	useGetAllWishListByUserIdQuery,
	useRemoveFromWishListMutation,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { setCheckoutStep } from "@/store/slice/checkoutSlice";
import { removeFromWishList } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
	const user = useSelector((state: RootState) => state.user.user);
	const [removeFromWishListMutation] = useRemoveFromWishListMutation();
	const [addToCartMutation] = useAddToCartMutation();
	const { data: wishlistData, isLoading } = useGetAllWishListByUserIdQuery(user?._id);
	const [wishlistItems, setWishListItems] = useState<BookDetails[]>([]);
	const dispatch = useDispatch();
	const router = useRouter();
	const [isAddToCart, setIsAddToCart] = useState(false);
	const cart = useSelector((state: RootState) => state.cart.items);
	const wishlist = useSelector((state: RootState) => state.wishlist.items);
	console.log(wishlistItems);
	useEffect(() => {
		if (wishlistData?.success) {
			console.log("wishlist items: ", wishlistData);
			setWishListItems(wishlistData.data.products);
		}
	}, [wishlistData]);

	async function handleRemoveFromWishList(productId: string) {
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
			}
		} catch (e: any) {
			toast.error(e?.data?.message || "Failed to remove from wishlist");
		}
	}

	async function handleAddToCart(productId: string) {
		setIsAddToCart(true);
		try {
			const result = await addToCartMutation({
				productId,
				quantity: 1,
			}).unwrap();

			if (result.success && result.data) {
				dispatch(setCheckoutStep("cart"));
				dispatch(addToCart(result.data));
				toast.success(result.message || "Added to cart successfully.");
			} else {
				throw new Error(result.message || "Failed to add item in cart");
			}
		} catch (e: any) {
			toast.error(e?.data?.message || "Failed to add item in cart");
		} finally {
			setIsAddToCart(false);
		}
	}

	const isItemExistInCart = (productId: string) => {
		return cart.some((item) => item?.product?._id === productId);
	};

	if (isLoading) {
		return <PageLoader />;
	}

	if (wishlistItems.length === 0)
		return (
			<NoData
				message="Your wishlist is empty."
				description="Looks like you haven't added any items to your wishlist yet. 
             Browse our collection and save your favorites!"
				buttonText="Browse Books"
				imageUrl="/images/wishlist.webp"
				onClick={() => router.push("/books")}
			/>
		);

	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-2">
				<Heart className="w-6 h-6 text-red-500" />
				<h3 className="text-2xl font-bold">My WishList</h3>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{wishlistItems?.map((item) => {
					return (
						<Link href={`/books/${item?._id}`} key={item?._id}>
							<Card className="border shadow-xl border-gray-300">
								<CardHeader>
									<CardTitle>{item?.title}</CardTitle>
									<CardDescription className="mt-1 text-sm font-medium">
										<span className="text-xs">&#8377;</span>
										{item?.finalPrice.toFixed(2)}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Image
										src={item?.images?.[0]}
										alt={item?.title}
										width={80}
										height={100}
										className="w-full aspect-square border object-contain"
									/>
								</CardContent>
								<CardFooter className="flex justify-between">
									<Button
										variant="outline"
										size="icon"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleRemoveFromWishList(item?._id);
										}}
										className="cursor-pointer hover:bg-red-500 hover:text-white flex justify-center items-center border border-gray-400"
									>
										<Trash2 className="h-5 w-5" />
									</Button>
									{item?.available ? (
										<>
											{isItemExistInCart(item?._id) ? (
												<Button
													className="bg-black text-white w-45 py-5 cursor-pointer"
													onClick={() => handleAddToCart(item?._id)}
													disabled={true}
													size="sm"
												>
													Item in cart
												</Button>
											) : (
												<Button
													className="bg-black text-white w-45 py-5 cursor-pointer"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														handleAddToCart(item?._id);
													}}
													disabled={isAddToCart}
													size="sm"
												>
													{isAddToCart ? (
														<>
															<Loader2
																className="animate-spin mr-2 "
																size={20}
															/>
															Adding to Cart...
														</>
													) : (
														<>
															<ShoppingCart className="mr-2 h-5 w-5" />
															Add To Cart
														</>
													)}
												</Button>
											)}
										</>
									) : (
										<p className="text-sm text-red-500 font-semibold">Not Available</p>
									)}
								</CardFooter>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Page;
