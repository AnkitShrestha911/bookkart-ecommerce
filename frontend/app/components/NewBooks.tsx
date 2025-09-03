"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookDetails } from "@/lib/type";
import { useGetAllProductsQuery } from "@/store/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import BookCardSkeleton from "./ShimmerEffect";

const NewBooks = () => {
	const [currentBookSlide, setCurrentBookSlide] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const { data: apiResponse = {}, isLoading } = useGetAllProductsQuery({});
	const [books, setBooks] = useState<BookDetails[]>([]);

	// Show only top 9 books
	const displayBooks = books.slice(0, 9);
	const totalSlides = Math.ceil(displayBooks.length / 3); // Can be 1, 2, or 3

	useEffect(() => {
		if (apiResponse.success) {
			setBooks(apiResponse.data);
		}
	}, [apiResponse]);

	function startScrollTimer() {
		if (timerRef.current) clearInterval(timerRef.current);

		if (totalSlides > 1) {
			timerRef.current = setInterval(() => {
				setCurrentBookSlide((prev) => (prev + 1) % totalSlides);
			}, 5000);
		}
	}

	useEffect(() => {
		startScrollTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [totalSlides]);

	function prevSlide() {
		setCurrentBookSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
		startScrollTimer();
	}

	function nextSlide() {
		setCurrentBookSlide((prev) => (prev + 1) % totalSlides);
		startScrollTimer();
	}

	function calculateDiscount(price: number, finalPrice: number): number {
		if (price > finalPrice && price > 0) {
			return Math.round(((price - finalPrice) / price) * 100);
		}
		return 0;
	}

	return (
		<section className="py-10 bg-gray-50">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-12">Newly Added Books</h2>
				<div className="relative">
					{isLoading ? (
						<div className="flex mt-[-20px]">
							<BookCardSkeleton />
							<BookCardSkeleton />
							<BookCardSkeleton />
							<BookCardSkeleton />
						</div>
					) : displayBooks.length > 0 ? (
						<>
							<div className="overflow-hidden">
								<div
									className="flex transition-transform duration-500 ease-in-out"
									style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
								>
									{Array.from({ length: totalSlides }).map((_, slideIndex) => (
										<div key={slideIndex} className="flex-none w-full">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
												{displayBooks
													.slice(slideIndex * 3, slideIndex * 3 + 3)
													.map((book) => (
														<Card key={book._id} className="relative">
															<CardContent className="p-4">
																<Link href={`/books/${book._id}`}>
																	<div className="relative">
																		<Image
																			src={book.images[0]}
																			alt={book.title}
																			width={200}
																			height={300}
																			className="mb-4 h-[200px] w-full object-cover rounded-md"
																		/>
																		{calculateDiscount(
																			book.price,
																			book.finalPrice
																		) > 0 && (
																			<span className="absolute left-0 top-2 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white">
																				{calculateDiscount(
																					book.price,
																					book.finalPrice
																				)}
																				% Off
																			</span>
																		)}
																	</div>
																	<h3 className="mb-4 line-clamp-2 text-sm font-medium">
																		{book.title}
																	</h3>
																	<div className="flex items-center justify-between">
																		<div className="flex items-baseline gap-2">
																			<div>
																				<span className="text-lg">
																					&#8377;
																				</span>
																				<span className="text-2xl font-bold">
																					{
																						book.finalPrice
																					}
																				</span>
																			</div>
																			{book.price && (
																				<span className="text-lg tracking-wide text-muted-foreground font-bold line-through">
																					{book.price}
																				</span>
																			)}
																		</div>
																		<div className="flex justify-between items-center text-xs font-medium text-zinc-600">
																			<span>
																				{book.condition}
																			</span>
																		</div>
																	</div>

																	<div className="pt-4">
																		<Button className="flex float-end cursor-pointer select-none mb-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-600">
																			Buy Now
																		</Button>
																	</div>
																</Link>
															</CardContent>
														</Card>
													))}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Arrows and dots only show if > 1 slide */}
							{totalSlides > 1 && (
								<>
									<button
										className="absolute left-0 cursor-pointer hover:bg-amber-50 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
										onClick={prevSlide}
									>
										<ChevronLeft className="w-6 h-6" />
									</button>
									<button
										className="absolute right-0 cursor-pointer hover:bg-amber-50 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
										onClick={nextSlide}
									>
										<ChevronRight className="w-6 h-6" />
									</button>

									<div className="mt-8 flex justify-center space-x-2">
										{Array.from({ length: totalSlides }).map((_, dot) => (
											<button
												key={dot}
												onClick={() => {
													setCurrentBookSlide(dot);
													startScrollTimer();
												}}
												className={`h-3 w-3 rounded-full ${
													currentBookSlide === dot
														? "bg-blue-600"
														: "bg-gray-600"
												} cursor-pointer`}
											></button>
										))}
									</div>
								</>
							)}
						</>
					) : (
						<p className="text-center">No Books Available</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default NewBooks;
