"use client";

import { BookDetails } from "@/lib/type";
import {
	useCheckLoginMutation,
	useCreateProductMutation,
	useUpdateUserProfileMutation,
} from "@/store/api";
import { logout, openLoginDialog, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Link from "next/link";
import { Book, Camera, ChevronRight, DollarSign, HelpCircle, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { filters } from "@/utils/contants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
	const [uploadImages, setUploadImages] = useState<string[]>([]);
	const [addProducts, { isLoading }] = useCreateProductMutation();
	const [freeShippingCheck, setFreeShippingCheck] = useState<boolean | string>(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.user);
	const [checkLoginMutation] = useCheckLoginMutation();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		control,
		formState: { errors },
	} = useForm<BookDetails>();

	const paymentMode = watch("paymentMode");

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const newFiles = Array.from(files);
			const currentFiles = watch("images") || [];

			setUploadImages((prevImage) =>
				[...prevImage, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 4)
			);

			setValue("images", [...currentFiles, ...newFiles].slice(0, 4) as string[]);
		}
	};

	const removeImage = (index: number) => {
		setUploadImages((prev) => prev.filter((_, idx) => idx !== index));
		const currentFiles = watch("images") || [];

		const uploadFiles = currentFiles.filter((_, idx) => idx !== index);
		setValue("images", uploadFiles);
	};

	const validateShippingCharges = () => {
		const shippingCharge = watch("shippingCost");
		if (!shippingCharge.trim() && !freeShippingCheck) {
			return "Shipping field is required";
		}
		if (!freeShippingCheck && shippingCharge.trim() !== "" && isNaN(parseInt(shippingCharge))) {
			return "Shipping cost must be a number.";
		}
	};

	const onSubmit = async (data: BookDetails) => {
		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (key !== "images") {
					formData.append(key, value as string);
				}
			});

			if (Array.isArray(data.images) && data.images.length > 0) {
				data.images.forEach((image) => formData.append("images", image));
			}

			if (data.paymentMode === "UPI") {
				formData.set(
					"paymentDetails",
					JSON.stringify({ upiId: data.paymentDetails.upiId })
				);
			} else if (data.paymentMode === "Bank Account") {
				formData.set(
					"paymentDetails",
					JSON.stringify({ bankDetails: data.paymentDetails.bankDetail })
				);
			}

			const result = await addProducts(formData).unwrap();
			if (result.success) {
				router.push(`books/${result.data._id}`);
				toast.success("Book added Successfully");
				reset();
			}
		} catch (e: any) {
			if (e?.status === 401) {
				dispatch(logout());
				dispatch(openLoginDialog());
			} else {
				toast.error(e?.data?.message || "Failed to add book, please try again later");
			}
		}
	};

	useEffect(() => {
		async function checkLoginAuth() {
			try {
				await checkLoginMutation({}).unwrap();
			} catch (e: any) {
				if (e?.status === 401) {
					dispatch(logout());
				}
			}
		}

		checkLoginAuth();
	}, []);

	const handleLoginOpen = () => {
		dispatch(toggleLoginDialog());
	};

	if (!user) {
		return (
			<NoData
				message="Please log in to access your sell page."
				description="You need to be logged in to view your sell page ."
				buttonText="Login"
				imageUrl="/images/login.jpg"
				onClick={handleLoginOpen}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="mb-10 text-center">
					<h1 className="text-4xl text-blue-600 font-bold">Sell Your Used Books</h1>
					<p className="text-xl mb-4 mt-2 text-gray-600">
						Submit a free classified ad to sell your used books for cash in India.
					</p>
					<Link
						href=""
						className="hover:underline text-blue-600 inline-flex items-center"
					>
						Learn how it works
						<ChevronRight className="h-4 w-4 ml-1 mt-[2px]" />
					</Link>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					<Card className="shadow-lg border-t-4 border-t-blue-500">
						<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
							<CardTitle className="text-2xl text-blue-700 flex items-center">
								<Book className="w-6 h-6 mr-2" />
								Book Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6 pt-6">
							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="title"
									className="md:w-1/4 font-medium text-gray-700"
								>
									Ad Title
								</Label>
								<div className="md:w-3/4">
									<Input
										{...register("title", {
											required: "Title is required",
										})}
										placeholder="Enter your ad title"
										type="text"
									/>

									{errors.title && (
										<p className="text-red-500 text-sm">
											{errors.title.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="category"
									className="md:w-1/4 font-medium text-gray-700"
								>
									Book Type
								</Label>

								<div className="md:w-3/4">
									<Controller
										name="category"
										control={control}
										rules={{ required: "Book Type is required" }}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Please select book type" />
												</SelectTrigger>
												<SelectContent>
													{filters.category.map((category) => (
														<SelectItem key={category} value={category}>
															{category}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.category && (
										<p className="text-red-500 text-sm">
											{errors.category.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="condition"
									className="md:w-1/4 font-medium text-gray-700"
								>
									Book Condition
								</Label>

								<div className="md:w-3/4">
									<Controller
										name="condition"
										control={control}
										rules={{ required: "Book Condition is required" }}
										render={({ field }) => (
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												className="flex space-x-4 "
											>
												{filters.condition.map((condition) => (
													<div
														key={condition}
														className="flex items-center space-x-2"
													>
														<RadioGroupItem
															value={condition.toLowerCase()}
															id={condition.toLowerCase()}
															className="border border-black"
														/>

														<Label htmlFor={condition.toLowerCase()}>
															{condition}
														</Label>
													</div>
												))}
											</RadioGroup>
										)}
									/>
									{errors.condition && (
										<p className="text-red-500 text-sm">
											{errors.condition.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="category"
									className="md:w-1/4 font-medium text-gray-700"
								>
									For Class
								</Label>

								<div className="md:w-3/4">
									<Controller
										name="classType"
										control={control}
										rules={{ required: "Class Type is required" }}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Please select a class type" />
												</SelectTrigger>
												<SelectContent>
													{filters.classType.map((classtype) => (
														<SelectItem
															key={classtype}
															value={classtype}
														>
															{classtype}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.classType && (
										<p className="text-red-500 text-sm">
											{errors.classType.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="subject"
									className="md:w-1/4 font-medium text-gray-700"
								>
									Book Subject
								</Label>
								<div className="md:w-3/4">
									<Input
										{...register("subject", {
											required: "Subject is required",
										})}
										placeholder="Enter you book subject"
										type="text"
									/>

									{errors.subject && (
										<p className="text-red-500 text-sm">
											{errors.subject.message}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-2 ">
								<Label className="block mb-2 font-medium text-gray-700">
									Upload Images
								</Label>
								<Label htmlFor="images" className="cursor-pointer block">
									<div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
										<div className="flex flex-col items-center gap-2">
											<Camera className="w-8 h-8 text-blue-500" />
											<Label
												htmlFor="images"
												className="text-sm hover:underline cursor-pointer text-blue-600"
											>
												Click here to upload up to 4 images (size: 15 MB max
												each)
											</Label>
											<Input
												id="images"
												type="file"
												className="hidden"
												accept="images"
												multiple
												onChange={handleImageUpload}
											/>
										</div>
										{uploadImages.length > 0 && (
											<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
												{uploadImages.map((image, index) => (
													<div key={index} className="relative">
														<Image
															src={image}
															alt={`book image ${index + 1}`}
															width={200}
															height={200}
															className="rounded-lg object-cover w-full h-32 border border-gray-200"
															onClick={(e) => {
																e.stopPropagation();
																e.preventDefault();
															}}
														/>

														<Button
															onClick={(e) => {
																e.stopPropagation();
																e.preventDefault();
																removeImage(index);
															}}
															size="icon"
															variant="destructive"
															className="absolute -right-2 -top-2 cursor-pointer rounded-full"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												))}
											</div>
										)}
									</div>
								</Label>
							</div>
						</CardContent>
					</Card>

					{/* Optional Details */}
					<Card className="shadow-lg border-t-4 border-t-green-500">
						<CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
							<CardTitle className="text-xl text-green-700 flex items-center">
								<HelpCircle className="mr-2 h-6 w-6" />
								Optional Details
							</CardTitle>
							<CardDescription>(Descriptio, Author, MRP, etc...)</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="item-1">
									<AccordionTrigger className="cursor-pointer">
										Book Information
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-6">
											<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
												<Label
													htmlFor="price"
													className="md:w-1/4 font-medium text-gray-700"
												>
													MRP
												</Label>
												<div className="md:w-3/4">
													<Input
														{...register("price", {
															required: "Price is required",
														})}
														placeholder="Enter your book price"
														type="text"
													/>

													{errors.price && (
														<p className="text-red-500 text-sm">
															{errors.price.message}
														</p>
													)}
												</div>
											</div>

											<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
												<Label
													htmlFor="author"
													className="md:w-1/4 font-medium text-gray-700"
												>
													Author Name
												</Label>
												<div className="md:w-3/4">
													<Input
														{...register("author")}
														placeholder="Enter author name"
														type="text"
													/>
												</div>
											</div>

											<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
												<Label
													htmlFor="edition"
													className="md:w-1/4 font-medium text-gray-700"
												>
													Edition (Year)
												</Label>
												<div className="md:w-3/4">
													<Input
														{...register("edition")}
														placeholder="Enter edition year"
														type="text"
													/>
												</div>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="item-2">
									<AccordionTrigger className="cursor-pointer">
										Ad Description
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-6">
											<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
												<Label
													htmlFor="description"
													className="md:w-1/4 font-medium text-gray-700"
												>
													Description
												</Label>
												<div className="md:w-3/4">
													<Textarea
														{...register("description")}
														placeholder="Enter book description"
														rows={4}
													/>
												</div>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>

					{/* Price details */}
					<Card className="shadow-lg border-t-4 border-t-yellow-500">
						<CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
							<CardTitle className="text-2xl text-yellow-700 flex items-center">
								<DollarSign className="w-6 h-6 mr-2" />
								Price Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6 pt-6">
							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label
									htmlFor="title"
									className="md:w-1/4 font-medium text-gray-700"
								>
									Your Price <span className="text-sm">(&#8377;)</span>
								</Label>
								<div className="md:w-3/4">
									<Input
										id="finalPrice"
										{...register("finalPrice", {
											required: "Final Price is required",
										})}
										placeholder="Enter your book final price"
										type="text"
									/>

									{errors.title && (
										<p className="text-red-500 text-sm">
											{errors.title.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
								<Label className="md:w-1/4 mt-2 font-medium text-gray-700">
									Shipping Charges
								</Label>

								<div className="space-y-3 md:w-3/4">
									<div className="flex items-center gap-4">
										<Input
											id="shippingCost"
											{...register("shippingCost", {
												validate: validateShippingCharges,
											})}
											placeholder="Enter Shipping Charges"
											type="text"
											className="w-full md:w-1/2"
											disabled={watch("shippingCost") === "free"}
										/>
										<span className="text-sm">Or</span>
										<Controller
											name="shippingCost"
											control={control}
											rules={{ validate: validateShippingCharges }}
											render={({ field }) => (
												<Checkbox
													id="freeShipping"
													checked={field.value === "free"}
													onCheckedChange={(checked) => {
														field.onChange(checked ? "free" : "");
														setFreeShippingCheck(checked);
													}}
													className="border border-black"
												/>
											)}
										/>
										<Label htmlFor="freeShipping">Free Shipping</Label>
									</div>
									{errors.shippingCost && (
										<p className="text-red-500 text-sm">
											{errors.shippingCost.message}
										</p>
									)}
									<p className="text-gray-700 text-sm">
										Buyers prefer free shipping or low shipping charges.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Bank details */}
					<Card className="shadow-lg border-t-4 border-t-blue-500">
						<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
							<CardTitle className="text-2xl text-yellow-700 flex items-center">
								<Book className="w-6 h-6 mr-2" />
								Bank Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6 pt-6">
							<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
								<Label className="md:w-1/4 font-medium text-gray-700">
									Payment Mode
								</Label>

								<div className="sapce-y-2 md:w-3/4">
									<p className="text-sm text-muted-foreground mb-2">
										After your book is sold, in what mode would you like to
										receieve the payment?
									</p>
									<Controller
										name="paymentMode"
										control={control}
										rules={{ required: "Payment Mode is required" }}
										render={({ field }) => (
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												className="flex space-x-4"
												defaultValue="UPI"
											>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value="UPI"
														id="upi"
														{...register("paymentMode")}
														className=" border-black"
													/>
													<Label htmlFor="upi">UPI ID/Number</Label>
												</div>

												<div className="flex items-center space-x-2">
													<RadioGroupItem
														className="border-black"
														value="Bank Account"
														id="bank account"
														{...register("paymentMode")}
													/>
													<Label htmlFor="bank account">
														Bank Account
													</Label>
												</div>
											</RadioGroup>
										)}
									/>
									{errors.paymentMode && (
										<p className="text-red-500 text-sm">
											{errors.paymentMode.message}
										</p>
									)}
								</div>
							</div>
							{paymentMode === "UPI" ? (
								<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
									<Label
										htmlFor="subject"
										className="md:w-1/4 font-medium text-gray-700"
									>
										UPI ID
									</Label>
									<div className="md:w-3/4">
										<Input
											{...register("paymentDetails.upiId", {
												required: "UPI ID is required",
												pattern: {
													value: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/,
													message: "Invalid UPI ID",
												},
											})}
											placeholder="Enter your upi id"
										/>

										{errors.paymentDetails?.upiId && (
											<p className="text-red-500 text-sm">
												{errors.paymentDetails.upiId.message}
											</p>
										)}
									</div>
								</div>
							) : (
								<>
									<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
										<Label
											htmlFor="accountNumber"
											className="md:w-1/4 font-medium text-gray-700"
										>
											Account Number
										</Label>
										<div className="md:w-3/4">
											<Input
												{...register(
													"paymentDetails.bankDetail.accountNumber",
													{
														required: "Account number is required",
														pattern: {
															value: /^[0-9]{9,18}$/,
															message: "Invalid account number",
														},
													}
												)}
												placeholder="Enter your account number"
											/>

											{errors.paymentDetails?.bankDetail?.accountNumber && (
												<p className="text-red-500 text-sm">
													{
														errors.paymentDetails.bankDetail
															.accountNumber.message
													}
												</p>
											)}
										</div>
									</div>

									<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
										<Label
											htmlFor="ifsccode"
											className="md:w-1/4 font-medium text-gray-700"
										>
											IFSC Code
										</Label>
										<div className="md:w-3/4">
											<Input
												{...register("paymentDetails.bankDetail.ifscCode", {
													required: "IFSC code is required",
													pattern: {
														value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
														message: "Invalid bank ifsc code",
													},
												})}
												placeholder="Enter your bank ifsc code"
											/>

											{errors.paymentDetails?.bankDetail?.ifscCode && (
												<p className="text-red-500 text-sm">
													{
														errors.paymentDetails.bankDetail.ifscCode
															.message
													}
												</p>
											)}
										</div>
									</div>

									<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
										<Label
											htmlFor="bankname"
											className="md:w-1/4 font-medium text-gray-700"
										>
											Bank Name
										</Label>
										<div className="md:w-3/4">
											<Input
												{...register("paymentDetails.bankDetail.bankName", {
													required: "Bank name is required",
												})}
												placeholder="Enter your bank name"
											/>

											{errors.paymentDetails?.bankDetail?.bankName && (
												<p className="text-red-500 text-sm">
													{
														errors.paymentDetails.bankDetail.bankName
															.message
													}
												</p>
											)}
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<div className="flex justify-center mt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="w-80 text-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
						>
							{isLoading ? (
								<>
									<Loader2 className="animate-spin mr-2" size={20} />{" "}
									<span>Saving...</span>
								</>
							) : (
								"Post Your Book"
							)}
						</Button>
					</div>
					<p className="text-sm text-center text-gray-600 mt-2">
						By clicking "Post Your Book", you agree to our{" "}
						<Link href="/terms-of-use" className="text-blue-500 hover:underline">
							Terms of Use,{" "}
						</Link>
						<Link href="/privacy-policy" className="text-blue-500 hover:underline">
							Privacy Policy
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Page;
