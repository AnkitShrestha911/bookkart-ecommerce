"use client";

import { Button } from "@/components/ui/button";
import { bannerImages, buySteps, sellSteps } from "@/utils/contants";
import { BookOpen, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewBooks from "./components/NewBooks";

export default function Home() {
	const [currentImages, setCurrentImages] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentImages((prev) => (prev + 1) % bannerImages.length);
		}, 5000);

		return () => clearInterval(timer);
	}, []);

	return (
		<main className="min-h-screen">
			<section className="relative h-[600px] overflow-hidden">
				{bannerImages.map((image, index) => {
					return (
						<div
							key={index}
							className={`absolute inset-0 transition-opacity duration-1000 ${
								currentImages === index ? "opacity-100" : "opacity-0"
							}`}
						>
							<Image
								src={image}
								fill
								alt="banner"
								className="object-cover"
								priority={index === 0}
							/>

							<div className="absolute inset-0 bg-black/50"></div>
						</div>
					);
				})}

				<div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-8">
						Buy and Sell Books Online in India
					</h1>
					<div className="flex flex-col sm:flex-row gap-6">
						<Link href="/books">
							<Button
								size="lg"
								className="group bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-8 py-6 cursor-pointer tracking-wider"
							>
								<div className="flex items-center gap-3">
									<div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
										<ShoppingBag className="w-6 h-6" />
									</div>
									<div className="text-left">
										<div className="text-sm opacity-90">Start Shopping</div>
										<div className="font-semibold">Buy Used Books</div>
									</div>
								</div>
							</Button>
						</Link>

						<Link href="/book-sell">
							<Button
								size="lg"
								className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-xl px-8 py-6 cursor-pointer tracking-wider"
							>
								<div className="flex items-center gap-3">
									<div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
										<BookOpen className="w-6 h-6" />
									</div>
									<div className="text-left">
										<div className="text-sm opacity-90">Start Selling</div>
										<div className="font-semibold">Sell Old Books</div>
									</div>
								</div>
							</Button>
						</Link>
					</div>
				</div>
			</section>
			<NewBooks />
			<Link href="/books">
				<Button
					size="lg"
					className="flex mt-10 mb-10 mx-auto bg-yellow-500 px-10 py-6 rounded-xl cursor-pointer" 
				>
					<div className="text-sm">Explore All Books</div>
				</Button>
			</Link>

			{/* Sell section */}

			<section className="py-16 bg-amber-50">
				<div className="container mx-auto px-4">
					<div className="text-center font-bold mb-4">
						<h2 className="text-3xl font-bold mb-4 text-black">
						How to SELL your old books online on BookKart?
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
						Saving some good amount of money by buying used books is just 3 steps away from you :)
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 relative">
						<div className="hidden md:block absolute top-1/2 left-1/4 right-1/2 h-0.5 border-t-2 border-dashed border-gray-300 -z-10"></div>
						{
							sellSteps.map((step,index)=> {
								return <div key={index} className="relative flex flex-col h-full">
									<div className="bg-white rounded-xl p-8 shadow-lg text-center flex flex-col">
										<div className="absolute top-2 left-14 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4  py-1 rounded-full text-sm font-medium z-10">
										{
											step.step
										}
										
										</div>
										<div className="h-16 mb-2 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
										{
											step.icon
										}
										</div>
										<h3 className="font-semibold mb-2">{step.title}</h3>
										<p className="text-sm text-gray-600 flex-grow">{step.description}</p>

									</div>
								</div>
							})
						}

					</div>

				</div>

			</section>

			{/* Buy Section */}

			
			<section className="py-16 bg-gradient-to-b from-gray-50 to-white">
				<div className="container mx-auto px-4">
					<div className="text-center font-bold mb-4">
						<h2 className="text-3xl font-bold mb-4 text-black">
						How to BUY second hand books online on BookKart?
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
						Saving some good amount of money by buying used books is just 3 steps away from you :)
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 relative">
						<div className="hidden md:block absolute top-1/2 left-1/4 right-1/2 h-0.5 border-t-2 border-dashed border-gray-300 -z-10"></div>
						{
							buySteps.map((step,index)=> {
								return <div key={index} className="relative flex flex-col h-full">
									<div className="bg-yellow-400 rounded-xl p-8 shadow-lg text-center flex flex-col">
										<div className="absolute top-2 left-14 -translate-x-1/2 bg-primary -400 text-white px-4  py-1 rounded-full text-sm font-medium z-10">
										{
											step.step
										}
										
										</div>
										<div className="h-16 mb-2 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
										{
											step.icon
										}
										</div>
										<h3 className="font-semibold mb-2">{step.title}</h3>
										<p className="text-sm text-gray-600 flex-grow">{step.description}</p>

									</div>
								</div>
							})
						}

					</div>

				</div>

			</section>

		</main>
	);
}
