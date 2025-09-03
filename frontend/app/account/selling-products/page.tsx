"use client";
import NoData from "@/app/components/NoData";
import PageLoader from "@/app/components/PageLoader";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteProductBySellerIdMutation, useGetProductBySellerIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import { Package, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
	const user = useSelector((state: RootState) => state.user.user);
	const router = useRouter();
	const [deleteProducyById] = useDeleteProductBySellerIdMutation();
	const { data: products, isLoading } = useGetProductBySellerIdQuery(user?._id);
	const [books, setBooks] = useState<BookDetails[]>([]);

	useEffect(() => {
		if (products?.success) {
			setBooks(products.data.filter((item: BookDetails) => item.available));
		}
	}, [products]);

	const handleDeleteProduct = async (productId: string) => {
		try {
			const result = await deleteProducyById(productId).unwrap();
			if (result.success) {
				toast.success("Book deleted successfully");
			} else {
				throw new Error("Failed to delete book");
			}
		} catch (e: any) {
			toast.error(e.data.message || "Failed to delete book");
		}
	};

	if (isLoading) {
		return <PageLoader />;
	}

	if (books.length === 0) {
		return (
			<div className="my-10 max-w-3xl justify-center mx-auto">
				<NoData
					imageUrl="/images/no-book.jpg"
					message="You haven't sold any books yet."
					description="Start selling your books to reach potential buyers. List your first book now and make it available to others."
					onClick={() => router.push("/book-sell")}
					buttonText="Sell Your First Book"
				/>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-b from-purple-50 to-white py-6">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-bold text-purple-700 mb-4">Your Listed Books</h1>
					<p className="text-xl text-gray-600 mb-4">Manage and track your listed books</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{books.map((product: BookDetails) => {
						return (
							<Link href={`/books/${product?._id}`} key={product?._id}>
								<Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-500 cursor-pointer">
									<CardHeader className="bg-gradient-to-r from-purle-50 to-indigo-50 p-4">
										<CardTitle className="flex items-center text-purple-700 text-xl">
											<Package className="mr-2 h-5 w-5" />
											{product?.title}
										</CardTitle>
										<CardDescription>{product?.subject}</CardDescription>
									</CardHeader>
									<CardContent className="">
										<div className="mb-4">
											<Image
												src={product?.images?.[0]}
												alt={product?.title}
												width={80}
												height={100}
												className="w-60 aspect-square rounded-xl object-contain"
											/>
										</div>
										<div className="space-y-2">
											<p className="text-sm text-gray-500">
												Category: {product?.category}
											</p>
											<p className="text-sm text-gray-500">
												Class: {product?.classType}
											</p>
											<div className="flex justify-between items-center">
												<Badge
													variant="secondary"
													className="bg-purple-100 text-purple-800"
												>
													<span className="text-xs">&#8377;</span>
													<span className="text-sm">
														{product?.finalPrice}
													</span>
												</Badge>
												<span className="text-sm text-gray-500 line-through">
													<span className="text-xs">&#8377;</span>
													{product?.price}
												</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className="bg-purple-50  pl-4 flex">
										<Button
											variant="destructive"
											size="lg"
											className="w-full font-semibold tracking-wide cursor-pointer hover:bg-red-900"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleDeleteProduct(product?._id);
											}}
										>
											<Trash2 className="h-5 w-5 mr-2" />
											Delete
										</Button>
									</CardFooter>
								</Card>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Page;
