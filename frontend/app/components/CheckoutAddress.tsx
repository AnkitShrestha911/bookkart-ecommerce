"use client";

import { Address } from "@/lib/type";
import { useCreateOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddressResponse {
	success: boolean;
	message: string;
	data: {
		addresses: Address[];
	};
}

const addressFormSchema = zod.object({
	phoneNumber: zod.string().min(10, "Phone number must be 10 digits"),
	addressLine1: zod.string().min(15, "Address line 1 atleast 15 characters"),
	addressLine2: zod.string().optional(),
	city: zod.string().min(3, "City atleast 3 character"),
	state: zod.string().min(3, "State atleast 3 character"),
	pincode: zod.string().min(6, "Pincode must be 6 character"),
});

type AddressFormValues = zod.infer<typeof addressFormSchema>;

interface CheckoutAddressProps {
	onAddressSelect: (address: Address) => void;
	selectAddressId?: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ onAddressSelect, selectAddressId }) => {
	const { data: addressData, isLoading } = useGetAddressQuery() as {
		data: AddressResponse | undefined;
		isLoading: boolean;
	};

	const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const addresses = addressData?.data?.addresses || [];

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressFormSchema),
		defaultValues: {
			phoneNumber: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: "",
			pincode: "",
		},
	});

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		form.reset(address);
		setShowAddressForm(true);
	};

	const onSubmit = async (data: AddressFormValues) => {
		try {
			let result;
			if (editingAddress) {
				const updatedAddress = {
					...editingAddress,
					...data,
					addressId: editingAddress._id,
				};
				result = await createOrUpdateAddress(updatedAddress).unwrap();
			} else {
				result = await createOrUpdateAddress(data).unwrap();
			}

			setShowAddressForm(false);
			setEditingAddress(null);
		} catch (e) {
			console.log(e);
		}
	};

	if (isLoading) {
		return <h1>Loading Address...</h1>;
	}

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				{addresses.map((address) => {
					return (
						<Card
							key={address._id}
							className={`relative overflow-hidden rounded-lg  border transition-all duration-300 ${
								selectAddressId === address._id
									? "border-blue-500 shadow-lg"
									: "border-gray-200 shadow-md hover:shadow-lg"
							}`}
						>
							<CardContent className="p-6 space-y-4">
								<div className="flex items-center justify-between">
									<Checkbox
										checked={selectAddressId === address._id}
										onCheckedChange={() => onAddressSelect(address)}
										className="w-5 h-5 border border-black"
									/>

									<div className="flex items-center justify-between">
										<Button
											size="icon"
											variant="ghost"
											className="cursor-pointer"
											onClick={() => handleEditAddress(address)}
										>
											<Pencil className="w-5 h-5 text-gray-600 hover:blue-500" />
										</Button>
									</div>
								</div>

								<div className="text-sm text-gray-600">
									<p>{address?.addressLine1}</p>
									{address?.addressLine2 && <p>{address.addressLine2}</p>}

									<p>
										{address.city},{address.state},{address.phoneNumber}
									</p>
									<p>Phone: {address.phoneNumber}</p>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
				<DialogTrigger asChild>
					<Button className="w-full cursor-pointer" variant="outline">
						<Plus className="h-6 w-6 mr-2" />{" "}
						{editingAddress ? "Edit Address" : "Add New Address"}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[420px]">
					<DialogHeader>
						<DialogTitle>
							{editingAddress ? "Edit Address" : "Add New Address"}
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number:</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter 10-digit phone number"
												{...field}
												onChange={(e) => {
													const numericValue = e.target.value.replace(
														/\D/g,
														""
													); // remove non-digits
													field.onChange(numericValue);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="addressLine1"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 1:</FormLabel>
										<FormControl>
											<Input
												placeholder="Street address, House number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="addressLine2"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 2 (optional):</FormLabel>
										<FormControl>
											<Input
												placeholder="Street address, House number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City:</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your city"
													{...field}
													onChange={(e) => {
														const alphaOnly = e.target.value.replace(
															/[^a-zA-Z]/g,
															""
														); // remove non-letters
														field.onChange(alphaOnly);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State:</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your state"
													{...field}
													onChange={(e) => {
														const alphaOnly = e.target.value.replace(
															/[^a-zA-Z]/g,
															""
														); // remove non-letters
														field.onChange(alphaOnly);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="pincode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pincode:</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your pincode"
												{...field}
												onChange={(e) => {
													const numericValue = e.target.value.replace(
														/\D/g,
														""
													); // remove non-digits
													field.onChange(numericValue);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit">
								{editingAddress ? "Update Address" : "Add Address"}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CheckoutAddress;
