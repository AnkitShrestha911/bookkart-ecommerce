"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
	BookLock,
	ChevronRight,
	FileTerminal,
	Heart,
	HelpCircle,
	Lock,
	LogOut,
	Menu,
	Package,
	PiggyBank,
	Search,
	ShoppingCart,
	User,
	User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AuthPage from "./AuthPage";
import { useCheckLoginMutation, useGetCartByUserIdQuery, useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";
import { resetCheckout } from "@/store/slice/checkoutSlice";

const Header = () => {
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [logoutMutation] = useLogoutMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);
	const [checkLoginMutation] = useCheckLoginMutation();
	const [ImageValid, setImageValid] = useState(true);
	const cart = useSelector((state: RootState) => state.cart);
	const pathname = usePathname();

	const user = useSelector((state: RootState) => state.user.user);
	const userPlaceholder = user?.name
		?.split(" ")
		.map((name: string) => name[0])
		.join("");

	const cartItemCount = useSelector((state: RootState) =>
		state.cart.items.reduce((accu, curr) => accu + curr.quantity, 0)
	);

	const { data: cartData = {} } = useGetCartByUserIdQuery(user?._id, { skip: !user });

	useEffect(() => {
		if (cartData?.success && cartData?.data) {
			dispatch(setCart(cartData.data));
		}
	}, [cartData, dispatch]);

	async function checkLoginAuth() {
		if (!user) {
			handleLogout();
			return;
		}
		try {
			await checkLoginMutation({}).unwrap();
		} catch (e: any) {
			if (e?.status === 401) {
				dispatch(logout());
			}
		}
	}

	useEffect(() => {
		if (user) {
			checkLoginAuth();
		}
	}, [pathname]);

	useEffect(() => {
		if (cart.items.length === 0) {
			dispatch(resetCheckout());
		}
	}, [cart]);

	function handleLoginClick() {
		dispatch(toggleLoginDialog());
		setIsDropDownOpen(false);
	}

	function handleSearch() {
		if (searchValue.trim()) {
			router.push(`/books?search=${encodeURIComponent(searchValue)}`);
			setTimeout(() => {
				setSearchValue("");
			}, 1000);
		}
	}

	function handleProtectionNavigation(href: string) {
		if (user) {
			router.push(href);
			setIsDropDownOpen(false);
		} else {
			dispatch(toggleLoginDialog());
			setIsDropDownOpen(false);
		}
	}
	async function handleLogout() {
		try {
			const result = await logoutMutation({}).unwrap();
			if (result.success) {
				toast.success(result.message);
				dispatch(logout());
				setIsDropDownOpen(false);
				router.push("/");
			}
		} catch (e: any) {
			console.log(e);
			toast.error(e.data.message);
		}
	}

	const menuItems = [
		...(user && user
			? [
					{
						href: "/account/profile",
						content: (
							<div className="flex space-x-4 items-center p-2 border-b">
								<Avatar className="w-12 h-12 -ml-2 rounded-full">
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
								<div className="flex flex-col">
									<span className="font font-semibold text-md">{user.name}</span>
									<span className="text-xs text-gray-500">{user.email}</span>
								</div>
							</div>
						),
					},
			  ]
			: [
					{
						icons: <Lock className="h-5 w-5" />,
						label: "Login/Sign Up",
						onclick: handleLoginClick,
					},
			  ]),
		{
			icons: <User className="h-5 w-5" />,
			label: "My Profile",
			onclick: () => handleProtectionNavigation("/account/profile"),
		},
		{
			icons: <Package className="h-5 w-5" />,
			label: "My Orders",
			onclick: () => handleProtectionNavigation("/account/orders"),
		},
		{
			icons: <PiggyBank className="h-5 w-5" />,
			label: "My Selling Orders",
			onclick: () => handleProtectionNavigation("/account/selling-products"),
		},
		{
			icons: <ShoppingCart className="h-5 w-5" />,
			label: "My Cart",
			onclick: () => handleProtectionNavigation("/checkout/cart"),
		},
		{
			icons: <Heart className="h-5 w-5" />,
			label: "My WishList",
			onclick: () => handleProtectionNavigation("/account/wishlists"),
		},
		{
			icons: <User2 className="h-5 w-5" />,
			label: "About Us",
			href: "/about-us",
		},

		{
			icons: <FileTerminal className="h-5 w-5" />,
			label: "Term & Use",
			href: "/term-of-use",
		},
		{
			icons: <BookLock className="h-5 w-5" />,
			label: "Privacy Polichy",
			href: "/privacy-policy",
		},

		{
			icons: <HelpCircle className="h-5 w-5" />,
			label: "Help",
			href: "/how-it-works",
		},
		...(user && user
			? [
					{
						icons: <LogOut className="h-5 w-5" />,
						label: "logout",
						onclick: handleLogout,
					},
			  ]
			: []),
	];

	function MenuItems({ className = "" }) {
		return (
			<div className={className}>
				{menuItems?.map((item, index) => {
					return item?.href ? (
						<Link
							key={index}
							href={item.href}
							className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
							onClick={() => setIsDropDownOpen(false)}
						>
							{item.icons}
							<span>{item?.label}</span>
							{item?.content && <div className="mt-1">{item.content}</div>}
							<ChevronRight className="w-4 h-4 ml-auto" />
						</Link>
					) : (
						<button
							key={index}
							className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 cursor-pointer"
							onClick={item.onclick}
						>
							{item.icons}
							<span>{item?.label}</span>
							{item?.content && <div className="mt-1">{item.content}</div>}
							<ChevronRight className="w-4 h-4 ml-auto" />
						</button>
					);
				})}
			</div>
		);
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

	return (
		<header className="border-b bg-white sticky top-0 z-50">
			{/* Desktop header */}
			<div className="container w-[80%] hidden mx-auto lg:flex items-center justify-between p-4">
				<Link href="/" className="flex items-center">
					<Image
						src="/images/web-logo.png"
						width={450}
						height={100}
						alt="desktop-logo"
						className="h-15 w-auto"
					/>
				</Link>
				<div className="flex flex-1 items-center justify-center max-w-xl px-4">
					<div className="relative w-full">
						<Input
							type="text"
							placeholder="Book Name / Author / Subject / Publisher"
							className="w-full pr-10"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value.trim())}
							onKeyDown={(e) => {
								console.log("press a key");
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
						/>

						<Button
							size="icon"
							variant="ghost"
							className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={handleSearch}
						>
							<Search className="h-5 w-5" />
						</Button>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<Link href="/book-sell">
						<Button
							variant="secondary"
							className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 cursor-pointer"
						>
							Sell Used Book
						</Button>
					</Link>

					<DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="cursor-pointer text-gray-900 hover:bg-gray-200 border-1  shadow-sm outline-none select-none"
							>
								<Avatar className="w-8 h-8 rounded-full ">
									{ImageValid && user?.profilePicture ? (
										<AvatarImage
											src={user?.profilePicture}
											alt="user_image"
										></AvatarImage>
									) : userPlaceholder ? (
										<AvatarFallback className="text-black border border-black ">
											{userPlaceholder}
										</AvatarFallback>
									) : (
										<User className="ml-2 mt-2" />
									)}
								</Avatar>
								My Account
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-80 p-2">
							<MenuItems />
						</DropdownMenuContent>
					</DropdownMenu>
					<Link href="/checkout/cart">
						<div className="relative">
							<Button
								variant="ghost"
								className="relative cursor-pointer hover:bg-gray-300 text-gray-900 border-1 shadow-sm  outline-none select-none"
							>
								<ShoppingCart className="w-5 h-5 mr-2" />
								Cart
							</Button>
							{user && cartItemCount > 0 && (
								<span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
									{cartItemCount}
								</span>
							)}
						</div>
					</Link>
				</div>
			</div>
			{/* Mobile header */}

			<div className="container mx-auto flex lg:hidden items-center text-gray-800 justify-between py-4 px-1">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-80 p-0 text-black">
						<SheetHeader>
							<SheetTitle className="sr-only"></SheetTitle>
						</SheetHeader>
						<div className="border-b p-4">
							<Link href="/">
								<Image
									src="/images/web-logo.png"
									width={150}
									height={40}
									alt="mobile_logo"
									className="h-10 w-auto"
								/>
							</Link>
						</div>
						<MenuItems className="py-2" />
					</SheetContent>
				</Sheet>

				<Link href="/" className="flex items-center">
					<Image
						src="/images/web-logo.png"
						width={450}
						height={100}
						alt="desktop-logo"
						className="h-8 w-auto"
					/>
				</Link>
				<div className="flex flex-1 items-center justify-center max-w-xl px-4">
					<div className="relative w-full">
						<Input
							type="text"
							placeholder="Search Books..."
							className="w-full pr-10"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value.trim())}
							onKeyDown={(e) => {
								console.log("press a key");
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
						/>

						<Button
							size="icon"
							variant="ghost"
							className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={handleSearch}
						>
							<Search className="h-5 w-5" />
						</Button>
					</div>
				</div>
				<Link href="/checkout/cart">
					<div className="relative">
						<Button variant="ghost" className="relative">
							<ShoppingCart className="w-5 h-5 mr-2" />
						</Button>
						{user && cartItemCount > 0 && (
							<span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
								{cartItemCount}
							</span>
						)}
					</div>
				</Link>
			</div>
			<AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
		</header>
	);
};

export default Header;
