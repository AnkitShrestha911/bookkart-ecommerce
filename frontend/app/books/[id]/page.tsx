"use client";
import NoData from "@/app/components/NoData";
import PageLoader from "@/app/components/PageLoader";
import { ShareButton } from "@/app/components/Share";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookDetails, CartItem } from "@/lib/type";
import {
	useAddToCartMutation,
	useAddToWishListMutation,
	useFindProductInWishListQuery,
	useGetProductByIdQuery,
	useRemoveFromWishListMutation,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { setCheckoutStep } from "@/store/slice/checkoutSlice";
import { logout, openLoginDialog } from "@/store/slice/userSlice";
import { addToWishList, removeFromWishList } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { PlatformWorking } from "@/utils/contants";
import { formatDistanceToNow } from "date-fns";
import {
	CheckCircle,
	Heart,
	Loader2,
	MapPin,
	MessageCircle,
	Share,
	ShoppingCart,
	User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
	const params = useParams();
	const { id } = params;
	const [selectedImage, setSelectedImage] = useState(0);
	const router = useRouter();
	const [isAddToCart, setIsAddToCart] = useState(false);
	const [book, setBook] = useState<BookDetails | null>(null);
	const { data: apiResponse = {}, isLoading, isError } = useGetProductByIdQuery(id);
	const [addToCartMutation] = useAddToCartMutation();
	const { data } = useFindProductInWishListQuery(id || "");
	const [addToWishListMutation] = useAddToWishListMutation();
	const [removeFromWishListMutation] = useRemoveFromWishListMutation();
	const dispatch = useDispatch();
	const cart = useSelector((state: RootState) => state.cart.items);

	const wishlist = useSelector((state: RootState) => state.wishlist.items);
	const [findProductInWishlist, setFindProductInWihslist] = useState(false);

	useEffect(() => {
		if (apiResponse.success) {
			setBook(apiResponse.data);
		}
	}, [apiResponse]);

	useEffect(() => {
		if (data?.success) {
			setFindProductInWihslist(true);
			const productId = Array.isArray(id) ? id[0] : id || "";
			const isProductExistInWishlist = wishlist.some((item) =>
				item.products?.includes(productId)
			);

			if (!isProductExistInWishlist) {
				dispatch(addToWishList(data.data));
			}
		}
	}, [data]);

	function handleBuyNow(productId: string) {
		const isExist = cart.some((item: CartItem) => item.product._id === productId);
		if (isExist) {
			router.push("/checkout/cart");
			toast.success("Proceed to checkout");
		} else {
			handleAddToCart();
		}
	}
	async function handleAddToCart() {
		if (book) {
			setIsAddToCart(true);
			try {
				const result = await addToCartMutation({
					productId: book?._id,
					quantity: 1,
				}).unwrap();

				if (result.success && result.data) {
					dispatch(setCheckoutStep("cart"));
					dispatch(addToCart(result.data));
					toast.success(result.message || "Added to cart successfully.");
					router.push("/checkout/cart");
				} else {
					throw new Error(result.message || "Failed to add item in cart");
				}
			} catch (e: any) {
				if (e.status === 401) {
					dispatch(logout());
					dispatch(openLoginDialog());
				} else {
					toast.error(e?.data?.message);
				}
			} finally {
				setIsAddToCart(false);
			}
		}
	}

	async function handleAddToWishList(productId: string) {
		const isProductExistInWishlist = wishlist.some((item) =>
			item.products?.includes(productId)
		);
		try {
			if (isProductExistInWishlist) {
				const result = await removeFromWishListMutation(productId).unwrap();
				if (result.success) {
					dispatch(removeFromWishList(productId));
					toast.success(result.message || "Removed From WishList");
					setFindProductInWihslist(false);
				} else {
					throw new Error(result.message || "Failed to remove from wishlist");
				}
			} else {
				const result = await addToWishListMutation(productId).unwrap();
				if (result.success) {
					dispatch(addToWishList(result.data));
					toast.success(result.message || "Added to wishlist successfully.");
					setFindProductInWihslist(true);
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

	function calculateDiscount(price: number, finalPrice: number): number {
		if (price > finalPrice && price > 0) {
			return Math.round(((price - finalPrice) / price) * 100);
		}
		return 0;
	}

	function formatDate(datestring: Date) {
		const date = new Date(datestring);
		return formatDistanceToNow(date, { addSuffix: true });
	}

	if (isLoading) {
		return <PageLoader />;
	}

	if (!book || isError) {
		return (
			<div className="my-10 max-w-3xl justify-center mx-auto">
				<NoData
					imageUrl="/images/no-book.jpg"
					message="Loading...."
					description="Wait, we are fetching book details"
					onClick={() => router.push("/book-sell")}
					buttonText="Sell Your First Book"
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="mx-auto px-4 py-8">
				<nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="text-primary hover:underline">
						Home
					</Link>{" "}
					<span>/</span>
					<Link href="/books" className="text-primary hover:underline">
						Books
					</Link>{" "}
					<span>/</span>
					<span className="text-gray-600 line-clamp-1">{book.category}</span>
					<span>/</span>
					<span className="text-gray-600 line-clamp-1">{book.title}</span>
				</nav>

				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-2">
						<div className="relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md">
							<Image
								src={book.images[selectedImage]}
								alt={book.title}
								fill
								className="object-contain"
							/>

							{calculateDiscount(book.price, book.finalPrice) > 0 && (
								<span className="absolute left-0 top-2 rounded-r-lg text-sm font-medium px-2 py-1 bg-orange-600/90 text-white  hover:bg-orange-700">
									{calculateDiscount(book.price, book.finalPrice)}% OFF
								</span>
							)}
						</div>

						<div className="flex gap-4 overflow-x-auto py-2">
							{book.images.map((image, index) => {
								return (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
											selectedImage === index
												? "ring-2 ring-primary scale-105"
												: "hover:scale-105"
										} ml-2`}
									>
										<Image
											src={image}
											alt={book.title}
											fill
											className="object-cover"
										/>
									</button>
								);
							})}
						</div>
					</div>
					{/* Book Details */}

					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-wrap">{book.title}</h1>
								<p className="text-sm text-muted-foreground">
									Posted: {formatDate(book.createdAt)}
								</p>
							</div>

							<div className="flex gap-2 ">
								<ShareButton
									url={`${window.location.origin}/books/${book?._id}`}
									title={`Check out this book: ${book.title}`}
									text={`I found this interesting book on Book Kart: ${book.title}`}
								/>
								<Button
									className="cursor-pointer"
									variant="outline"
									onClick={() => handleAddToWishList(book._id)}
								>
									<Heart
										className={`h-4 w-4 mr-1  ${
											findProductInWishlist ? "fill-red-500" : ""
										}`}
									/>
									<span className="hidden md:inline">
										{findProductInWishlist ? "Remove" : "Add"}
									</span>
								</Button>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-baseline gap-2">
								<div>
									<span className="text-xl">&#8377;</span>
									<span className="text-3xl font-bold">{book.finalPrice}</span>
								</div>
								{book.price && (
									<span className="text-xl tracking-wide text-muted-foreground font-bold line-through">
										{book.price}
									</span>
								)}
								{book.available && (
									<Badge variant="secondary" className="text-green-600 text-sm">
										Shipping Available
									</Badge>
								)}
							</div>
							<div className="flex gap-4 flex-wrap">
								{book.available ? (
									<>
										<Button
											className="bg-yellow-400 hover:bg-yellow-500 text-black w-60 py-6 cursor-pointer"
											onClick={handleAddToCart}
											disabled={isAddToCart}
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

										<Button
											className="bg-blue-700 w-60 py-6 cursor-pointer"
											onClick={() => handleBuyNow(book?._id)}
										>
											Buy Now
										</Button>
									</>
								) : (
									<p className="text-xl text-red-500 font-semibold">
										Not Available
									</p>
								)}
							</div>

							<Card className="border bordergray-200 shadow-sm">
								<CardHeader>
									<CardTitle className="text-lg">Book Details</CardTitle>
								</CardHeader>
								<CardContent className="grid gap-4">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="font-medium text-muted-foreground">
											Subject/Title
										</div>
										<div>{book.subject}</div>

										<div className="font-medium text-muted-foreground">
											Course
										</div>
										<div>{book.classType}</div>

										<div className="font-medium text-muted-foreground">
											Category
										</div>
										<div>{book.category}</div>

										<div className="font-medium text-muted-foreground">
											Author
										</div>
										<div>{book.author}</div>

										<div className="font-medium text-muted-foreground">
											Edition
										</div>
										<div>{book.edition}</div>

										<div className="font-medium text-muted-foreground">
											Condition
										</div>
										<div>{book.condition}</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
				<div className="mt-2 grid md:grid-cols-2 gap-8">
					{/* description */}
					<Card className="border-none shadow-md">
						<CardHeader>
							<CardTitle className="text-lg">Description</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>{book.description}</p>
							<div className="border-t pt-4">
								<h3 className="font-medium mb-2">Our Community</h3>
								<p>
									We're not just another shopping website where you buy from
									professional sellers - we are a vibrant community of students,
									book lovers across India who deliver happiness to each other!
								</p>
							</div>

							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<div>Ad Id: {book._id}</div>
								<div>Posted: {formatDate(book.createdAt)}</div>
							</div>
						</CardContent>
					</Card>

					{/* Book seller detail */}
					<Card className="border-none shadow-md">
						<CardHeader>
							<CardTitle className="text-lg">Sold By</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center">
										<User2 className="h-6 w-6 text-blue-500" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-medium">{book.seller.name}</span>
											<Badge
												variant="secondary"
												className="text-green-600 font-bold text-sm"
											>
												<CheckCircle className="h-5 w-5" />
												verified
											</Badge>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin className="h-5 w-5" />
											{book?.seller?.addresses?.[0]?.city
												? `${book?.seller?.addresses?.[0].city} ${book?.seller?.addresses?.[0]?.state}`
												: "Location not specified"}
										</div>
									</div>
								</div>
							</div>
							{book.seller.phoneNumber && (
								<div className="flex items-center gap-2 text-sm ">
									<MessageCircle className="w-5 h-5" />
									<span>
										Contact:{" "}
										{book.seller?.phoneNumber
											? book.seller?.phoneNumber
											: "Not Available"}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
				{/* How it works ? */}
				<section className="mt-16">
					<h2 className="text-2xl mb-8 font-bold">How does it works?</h2>
					<div className="grid gap-8 md:grid-cols-3">
						{PlatformWorking.map((item, index) => {
							return (
								<Card
									key={index}
									className="bg-gradient-to-br from-amber-50 to-amber-100 border-none"
								>
									<CardHeader>
										<Badge className="w-fit mb-2">{item.step}</Badge>
										<CardTitle className="text-lg">{item.title}</CardTitle>
										<CardDescription>{item.description}</CardDescription>
									</CardHeader>

									<CardContent className="space-y-4">
										<Image
											src={item.image.src}
											alt={item.image.alt}
											width={120}
											height={120}
											className="mx-auto"
										/>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
};

export default page;
