"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { filters } from "@/utils/contants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllProductsQuery } from "@/store/api";
import { BookDetails } from "@/lib/type";
import BookCardSkeleton from "../components/ShimmerEffect";

const page = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedCategorys, setSelectedCategorys] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState("newest");
	const { data: apiResponse = {}, isLoading } = useGetAllProductsQuery({});
	const [books, setBooks] = useState<BookDetails[]>([]);
	const bookPerPage = 6;
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchParamValue, setSearchParamValue] = useState(searchParams.get("search") || "");

	useEffect(() => {
		const value = searchParams.get("search") || "";
		setSearchParamValue(value);
	}, [searchParams]);

	useEffect(() => {
		if (apiResponse.success) {
			setBooks(apiResponse.data);
		}
	}, [apiResponse]);

	function toggleFilter(section: string, item: string) {
		function updateFilter(prev: string[]) {
			return prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
		}
		switch (section) {
			case "condition":
				setSelectedConditions(updateFilter);
				break;
			case "classType":
				setSelectedTypes(updateFilter);
				break;
			case "category":
				setSelectedCategorys(updateFilter);
				break;
		}
		setCurrentPage(1);
	}

	const filterBooks = books.filter((book) => {
		const conditionMatch =
			selectedConditions.length === 0 ||
			selectedConditions
				.map((condition) => condition.toLowerCase())
				.includes(book.condition.toLowerCase());
		const typeMatch =
			selectedTypes.length === 0 ||
			selectedTypes.map((type) => type.toLowerCase()).includes(book.classType.toLowerCase());
		const categoryMatch =
			selectedCategorys.length === 0 ||
			selectedCategorys
				.map((category) => category.toLowerCase())
				.includes(book.category.toLowerCase());
		const searchMatch = searchParamValue
			? book.title.toLowerCase().includes(searchParamValue.toLowerCase()) ||
			  book.author.toLowerCase().includes(searchParamValue.toLowerCase()) ||
			  book.category.toLowerCase().includes(searchParamValue.toLowerCase()) ||
			  book.subject.toLowerCase().includes(searchParamValue.toLowerCase())
			: true;

		return conditionMatch && typeMatch && categoryMatch && searchMatch;
	});

	const sortedBooks = [...filterBooks].sort((a, b) => {
		switch (sortOption) {
			case "newest":
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			case "oldest":
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			case "price-low":
				return a.finalPrice - b.finalPrice;
			case "price-high":
				return b.finalPrice - a.finalPrice;
			default:
				return 0;
		}
	});
	const totalPages = Math.ceil(sortedBooks.length / bookPerPage);
	const paginatedBooks = sortedBooks.slice(
		(currentPage - 1) * bookPerPage,
		currentPage * bookPerPage
	);

	function handlePageChange(page: number) {
		setCurrentPage(page);
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

	return (
		<div className="min-h-screen bg-gray-100 ">
			<div className="container mx-auto px-4 py-8 pt-20">
				<nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="text-primary hover:underline">
						Home
					</Link>{" "}
					<span>/</span> <span>Books</span>
				</nav>
				<h1 className="mb-8 mt-8 text-3xl font-bold">
					Find from over 1000s of used books online
				</h1>
				<div className="grid gap-8 md:grid-cols-[300px_1fr]">
					<div className="space-y-6">
						<Accordion type="multiple" className="bg-white p-6 border rounded-lg">
							{Object.entries(filters).map(([key, values]) => {
								return (
									<AccordionItem key={key} value={key}>
										<AccordionTrigger className="text-lg font-semibold text-blue-500 hover:underline cursor-pointer">
											{key.charAt(0).toUpperCase() + key.slice(1)}
										</AccordionTrigger>
										<AccordionContent>
											<div className="mt-2 space-y-2 line-clamp-2">
												{values.map((value) => {
													return (
														<div
															key={value}
															className="flex items-center space-x-2"
														>
															<Checkbox
																key={value}
																checked={
																	key === "condition"
																		? selectedConditions.includes(
																				value
																		  )
																		: key === "classType"
																		? selectedTypes.includes(
																				value
																		  )
																		: selectedCategorys.includes(
																				value
																		  )
																}
																onCheckedChange={() =>
																	toggleFilter(key, value)
																}
																className="border border-black"
															/>
															<label
																htmlFor={value}
																className="text-sm font-medium leading-none"
															>
																{value}
															</label>
														</div>
													);
												})}
											</div>
										</AccordionContent>
									</AccordionItem>
								);
							})}
						</Accordion>
					</div>
					<div className="space-y-6">
						{isLoading ? (
							<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 space-y-8 justify-items-center">
								{Array.from({ length: 6 }).map((_, index) => {
									return <BookCardSkeleton />;
								})}
							</div>
						) : paginatedBooks.length > 0 ? (
							<>
								<div className="flex justify-between">
									<div className="mb-8 text-xl font-semibold">
										Buy Second Hand Books, Used Books Online In India
									</div>
									<Select value={sortOption} onValueChange={setSortOption}>
										<SelectTrigger className="w-[180px] focus:outline-none focus:ring-0 focus-visible:ring-0">
											<SelectValue placeholder="Sort By"></SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="newest">Newest First</SelectItem>
											<SelectItem value="oldest">Oldest First</SelectItem>
											<SelectItem value="price-low">
												Price: Low to High
											</SelectItem>
											<SelectItem value="price-high">
												Price: High to Low
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{paginatedBooks.map((book) => {
										return (
											<motion.div
												key={book._id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.5 }}
											>
												<Card
													className="group relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl bg-white border-0"
													title={book.title}
												>
													<CardContent>
														<Link href={`/books/${book._id}`}>
															<div className="relative ">
																<Image
																	src={book.images[0]}
																	alt={book.title}
																	height={300}
																	width={400}
																	className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
																/>
																<div className="absolute top-0 left-0 z-10 flex flex-col gap-2 p-2">
																	{calculateDiscount(
																		book.price,
																		book.finalPrice
																	) > 0 && (
																		<Badge className="bg-orange-600/90 text-white  hover:bg-orange-700">
																			{calculateDiscount(
																				book.price,
																				book.finalPrice
																			)}
																			% OFF
																		</Badge>
																	)}
																</div>

																<Button
																	variant="ghost"
																	size="icon"
																	className="absolute right-2 top-2 h-10 w-10  bg-white/80 backdrop-blur-sm transition-opacity  duration-300  hover:bg-white group-hover:opacity-100"
																>
																	<Heart className="text-red-500" />
																</Button>
															</div>
															<div className="p-4 space-y-2">
																<div className="flex items-start justify-between">
																	<h3 className="text-lg font-semibold text-orange-500 line-clamp-1">
																		{book.title}
																	</h3>
																</div>
																<p className="text-sm text-zinc-400 line-clamp-2">
																	{book?.description || ""}
																</p>
																{/* price */}
																<div className="flex items-baseline gap-2">
																	<div>
																		<span className="text-lg">
																			&#8377;
																		</span>
																		<span className="text-2xl font-bold">
																			{book?.finalPrice}
																		</span>
																	</div>
																	{book.price && (
																		<span className="text-lg tracking-wide text-muted-foreground font-bold line-through">
																			{book?.price}
																		</span>
																	)}
																</div>

																<div className="flex justify-between items-center text-sm text-zinc-400">
																	<span>
																		{formatDate(book.createdAt)}
																	</span>
																	<span>{book.condition}</span>
																</div>

																{/* time ago */}
															</div>
														</Link>
													</CardContent>
													<div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl"></div>
													<div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl"></div>
												</Card>
											</motion.div>
										);
									})}
								</div>

								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							</>
						) : (
							<NoData
								imageUrl="/images/no-book.jpg"
								message="No books available please try later."
								description="Try adjusting your filters or search criteria to find what you're looking for."
								onClick={() => router.push("/book-sell")}
								buttonText="Shell Your First Book"
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
