"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/lib/type";
import { useUpdateUserProfileMutation } from "@/store/api";
import { setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
	const [editing, setEditing] = useState(false);
	const user = useSelector((state: RootState) => state.user.user);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserData>({
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			phoneNumber: user?.phoneNumber || "",
		},
	});

	const [updateUser, { isLoading }] = useUpdateUserProfileMutation();

	useEffect(() => {
		reset({
			name: user?.name || "",
			email: user?.email || "",
			phoneNumber: user?.phoneNumber || "",
		});
	}, [user, editing]);

	const handleProfileEdit = async (data: UserData) => {
		const { name, phoneNumber } = data;
		try {
			const result = await updateUser({ userId: user?._id, userData: { name, phoneNumber } });
			if (result && result.data) {
				dispatch(setUser(result.data.data));
				setEditing(false);
				toast.success("Profile Updated Succesfully.");
			} else {
				throw new Error("Could not update profile");
			}
		} catch (e) {
			toast.error("Failed to update profile");
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg">
				<h1 className="text-4xl font-bold mb-2">My Profile</h1>
				<p>Manage your personal information and preferences</p>
			</div>

			<Card className="border-t-4 border-t-pink-500 shadow-lg">
				<CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
					<CardTitle className="text-2xl text-pink-700">Personal Information</CardTitle>
					<CardDescription>
						Update your profile details and contact information
					</CardDescription>
					<CardContent className="space-y-4 pt-6">
						<form onSubmit={handleSubmit(handleProfileEdit)}>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input
											id="username"
											placeholder="John Doe"
											disabled={!editing}
											className="pl-15 border-gray-500 pt-2"
											{...register("name")}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input
											id="email"
											placeholder="JohnDoe@gmail.com"
											disabled={true}
											className="pl-15 border-gray-500 pt-2"
											{...register("email")}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phonenumber">Phone Number</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input
											id="phonenumber"
											placeholder="+919999999999"
											disabled={!editing}
											className="pl-15 border-gray-500 pt-2"
											{...register("phoneNumber", {
												pattern: {
													value: /^\+91\d{10}$/,
													message:
														"Phone number must be in format +91XXXXXXXXXX",
												},
											})}
										/>
									</div>
									{errors.phoneNumber && (
										<p className="text-sm text-red-500 mt-1">
											{errors.phoneNumber.message}
										</p>
									)}
								</div>
							</div>
							<CardFooter className="flex justify-between p-0 mt-4">
								{editing ? (
									<>
										<Button
											type="button"
											variant="outline"
											className="mt-4 cursor-pointer border-gray-500"
											onClick={() => {
												setEditing(false);
												reset();
											}}
										>
											Discard Changes
										</Button>

										<Button
											type="submit"
											variant="outline"
											className="bg-gradient-to-r from-pink-500 to-rose-500 text-white cursor-pointer"
											disabled={isLoading}
										>
											{isLoading ? "Saving..." : "Save Changes"}
										</Button>
									</>
								) : (
									<>
										<Button
											type="button"
											variant="outline"
											className="bg-gradient-to-r from-pink-500 to-rose-500 text-white cursor-pointer"
											onClick={() => {
												setEditing(true);
											}}
										>
											Edit Profile
										</Button>
									</>
								)}
							</CardFooter>
						</form>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
};

export default Page;
