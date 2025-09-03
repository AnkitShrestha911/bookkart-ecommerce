"use client";

import { useLogoutMutation } from "@/store/api";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { accountNavigation } from "@/utils/contants";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const layout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const user = useSelector((state: RootState) => state.user.user);
	const dispatch = useDispatch();
	const router = useRouter();
	const [logoutMutation] = useLogoutMutation();
	const [ImageValid, setImageValid] = useState(true);
	const userPlaceholder = user?.name
		?.split(" ")
		.map((name: string) => name[0])
		.join("");

	async function handleLogout() {
		try {
			const result = await logoutMutation({}).unwrap();
			if (result.success) {
				toast.success(result.message);
				dispatch(logout());
				router.push("/");
			}
		} catch (e: any) {
			toast.error(e.data.message);
		}
	}

	async function handleOpenLogin() {
		dispatch(toggleLoginDialog());
	}

	useEffect(() => {
		const checkImage = async () => {
			if (!user?.profilePicture) return;

			try {
				const res = await fetch(user?.profilePicture, { method: "HEAD" });

				if (!res.ok || res.status === 429) {
					setImageValid(false);
				}
			} catch (err) {
				console.log("image error", err);
				setImageValid(false);
			}
		};

		checkImage();
	}, [user?.profilePicture]);

	if (!user) {
		return (
			<NoData
				message="Please log in to access your account."
				description="You need to be logged in to view your account."
				buttonText="Login"
				imageUrl="/images/login.jpg"
				onClick={handleOpenLogin}
			/>
		);
	}

	return (
		<div className="grid p-4 w-[90%] mx-auto lg:grid-cols-[370px_1fr]">
			<div className="hidden border-r m-5 rounded-lg p-2 bg-gradient-to-b from-violet-500 to-purple-700 lg:block">
				<div className="flex flex-col gap-2">
					<div className="flex h-[60px] items-center px-6">
						<Link href="/" className="flex items-center gap-2 font-semibold text-white">
							<span className="text-2xl">Your Account</span>
						</Link>
					</div>

					<div className="flex-1 space-y-4 py-4">
						<div className="px-6 py-2">
							<div className="flex items-center gap-4">
								<Avatar className="w-12 h-12 rounded-full">
									{ImageValid && user?.profilePicture ? (
										<AvatarImage
											src={user?.profilePicture}
											alt="user_image"
										></AvatarImage>
									) : (
										<AvatarFallback className="border border-black">
											{userPlaceholder}
										</AvatarFallback>
									)}
								</Avatar>
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none text-white">
										{user?.name}
									</p>
									<p className="text-xs text-purple-200 font-semibold">
										{user?.email}
									</p>
								</div>
							</div>
						</div>

						<Separator className="text-purple-400" />
						<div className="space-y-1 px-2">
							<nav className="grid items-start py-2 text-sm px-2 font-medium">
								{accountNavigation.map((item) => {
									const Icon = item.icon;
									const isActive = pathname === item.href;
									return (
										<Link
											href={item.href}
											key={item.href}
											className={`flex items-center gap-3 rounded-lg px-3 py-3 mb-2 ${
												isActive
													? `bg-gradient-to-r ${item.color} text-white`
													: "text-purple-100 hover:bg-purple-700"
											}`}
										>
											<Icon className="w-4 h-4" />
											{item.title}
										</Link>
									);
								})}
							</nav>
						</div>
					</div>

					{/* logout */}
					<div className="mt-auto flex p-4">
						<Button
							variant="secondary"
							className="w-full justify-start gap-2 cursor-pointer"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			<div className="flex flex-col">
				<main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-5">{children}</main>
			</div>
		</div>
	);
};

export default layout;
