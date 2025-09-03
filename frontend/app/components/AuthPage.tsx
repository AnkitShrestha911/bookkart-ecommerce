import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BASE_URL,
	useForgotPasswordMutation,
	useLoginMutation,
	useRegisterMutation,
} from "@/store/api";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type AuthOption = "login" | "singup" | "forgot";
interface LoginProps {
	isLoginOpen: boolean;
	setIsLoginOpen: (open: boolean) => void;
}
interface LoginFormData {
	email: string;
	password: string;
}

interface SignUpFormData {
	name: string;
	email: string;
	password: string;
	agreeTerm: boolean;
}

interface forgotPasswordFormData {
	email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
	const [currentTab, setCurrentTab] = useState<AuthOption>("login");
	const [showPassword, setShowPassword] = useState(false);
	const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);
	const [signupLoading, setSignupLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
	const [register] = useRegisterMutation();
	const [login] = useLoginMutation();
	const [forgotPasswordMutation] = useForgotPasswordMutation();
	const dispatch = useDispatch();
	const router = useRouter();

	const {
		register: registerLogin,
		handleSubmit: handleLoginSubmit,
		formState: { errors: loginError },
		reset: resetLoginFrom,
	} = useForm<LoginFormData>();
	const {
		register: registerSignUp,
		handleSubmit: handleSignUpSubmit,
		formState: { errors: signUpError },
		reset: resetSignUp,
	} = useForm<SignUpFormData>();
	const {
		register: registerForgotPassword,
		handleSubmit: handleForgotPasswordSubmit,
		formState: { errors: forgotPasswordError },
	} = useForm<forgotPasswordFormData>();

	const onSubmitSingUp = async (data: SignUpFormData) => {
		setSignupLoading(true);
		try {
			const { name, email, password } = data;
			const result = await register({ email, password, name }).unwrap();
			console.log("Register value: ", result);
			if (result.success) {
				resetSignUp();
				toast.success(
					"Verification link has been sent to your email, please check your email"
				);
				dispatch(toggleLoginDialog());
			}
		} catch (e: any) {
			console.log(e);
			toast.error(e.data.message);
		} finally {
			setSignupLoading(false);
		}
	};

	const onSubmitLogin = async (data: LoginFormData) => {
		setLoginLoading(true);
		try {
			const result = await login(data).unwrap();
			console.log("Login value: ", result);
			if (result.success) {
				toast.success(result.message);
				resetLoginFrom();
				dispatch(toggleLoginDialog());
				dispatch(authStatus());
				window.location.reload();
			}
		} catch (e: any) {
			console.log(e.data.message);
			toast.error(e.data.message);
		} finally {
			setLoginLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setGoogleLoading(true);
		try {
			setIsLoginOpen(false);
			router.push(`${BASE_URL}/auth/google`);
			dispatch(authStatus());
			setTimeout(() => {
				toast.success("Google Login Successfully.");
				router.push("/");
			}, 3000);
		} catch (e: any) {
			console.log(e.data.message);
			toast.error(e.data.message);
		} finally {
			setGoogleLoading(false);
		}
	};

	const handleForgotPassword = async (data: forgotPasswordFormData) => {
		setForgotPasswordLoading(true);
		try {
			const result = await forgotPasswordMutation(data.email).unwrap();
			if (result.success) {
				setForgotPasswordSuccess(true);
				toast.success("Reset password link has beed sent to your email.");
			}
		} catch (e: any) {
			console.log(e.data.message);
			toast.error(e.data.message);
		} finally {
			setForgotPasswordLoading(false);
		}
	};

	return (
		<Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
			<DialogContent className="sm:max-w-[425px] p-6">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-bold mb-4">
						Welcome to Book Kart
					</DialogTitle>
					<Tabs
						value={currentTab}
						onValueChange={(value) => setCurrentTab(value as AuthOption)}
					>
						<TabsList className="grid w-full grid-cols-3 mb-6">
							<TabsTrigger value="login" className="cursor-pointer">
								Login
							</TabsTrigger>
							<TabsTrigger value="signup" className="cursor-pointer">
								Sign Up
							</TabsTrigger>
							<TabsTrigger value="forgot" className="cursor-pointer">
								Forgot
							</TabsTrigger>
						</TabsList>
						<AnimatePresence mode="wait">
							<motion.div
								key={currentTab}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<TabsContent value="login" className="space-y-4">
									<form
										className="space-y-4"
										onSubmit={handleLoginSubmit(onSubmitLogin)}
									>
										<div className="relative">
											<Input
												{...registerLogin("email", {
													required: "Email is required",
												})}
												placeholder="Email"
												type="email"
												className="pl-10"
											/>
											<Mail
												className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
												size={20}
											/>
										</div>
										{loginError.email && (
											<p className="text-red-500 text-sm">
												{loginError.email.message}
											</p>
										)}

										<div className="relative">
											<Input
												{...registerLogin("password", {
													required: "Password is required",
												})}
												placeholder="Password"
												type={showPassword ? "text" : "password"}
												className="pl-10"
											/>
											<Lock
												className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
												size={20}
											/>
											{showPassword ? (
												<EyeOff
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
													size={20}
													onClick={() => setShowPassword(!showPassword)}
												/>
											) : (
												<Eye
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
													size={20}
													onClick={() => setShowPassword(!showPassword)}
												/>
											)}
										</div>
										{loginError.password && (
											<p className="text-red-500 text-sm">
												{loginError.password.message}
											</p>
										)}

										<Button
											className="cursor-pointer w-full font-bold select-none"
											type="submit"
										>
											{loginLoading ? (
												<Loader2 className="animate-spin mr-2" />
											) : (
												"Login"
											)}
										</Button>
									</form>

									<div className="flex items-center my-4">
										<div className="flex-1 h-px bg-gray-400"></div>
										<p className="mx-2 text-gray-600 text-sm">OR</p>
										<div className="flex-1 h-px bg-gray-400"></div>
									</div>

									<Button
										onClick={handleGoogleLogin}
										className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-200 cursor-pointer select-none"
									>
										{googleLoading ? (
											<>
												<Loader2 className="animate-spin mr-2" />
												Logging with Google...
											</>
										) : (
											<>
												<Image
													src="/icons/google.svg"
													alt="google logo"
													width={20}
													height={20}
												/>
												Login with Google
											</>
										)}
									</Button>
								</TabsContent>

								<TabsContent value="signup" className="">
									<form
										className="space-y-4"
										onSubmit={handleSignUpSubmit(onSubmitSingUp)}
									>
										<div className="relative">
											<Input
												{...registerSignUp("name", {
													required: "Name is required",
												})}
												placeholder="Name"
												type="text"
												className="pl-10"
											/>
											<User
												className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
												size={20}
											/>
										</div>
										{signUpError.name && (
											<p className="text-red-500 text-sm">
												{signUpError.name.message}
											</p>
										)}

										<div className="relative">
											<Input
												{...registerSignUp("email", {
													required: "Email is required",
												})}
												placeholder="Email"
												type="email"
												className="pl-10"
											/>
											<Mail
												className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
												size={20}
											/>
										</div>
										{signUpError.email && (
											<p className="text-red-500 text-sm">
												{signUpError.email.message}
											</p>
										)}
										<div className="relative">
											<Input
												{...registerSignUp("password", {
													required: "Password is required",
												})}
												placeholder="Password"
												type={showPassword ? "text" : "password"}
												className="pl-10"
											/>
											<Lock
												className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
												size={20}
											/>
											{showPassword ? (
												<EyeOff
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
													size={20}
													onClick={() => setShowPassword(!showPassword)}
												/>
											) : (
												<Eye
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
													size={20}
													onClick={() => setShowPassword(!showPassword)}
												/>
											)}
										</div>
										{signUpError.password && (
											<p className="text-red-500 text-sm">
												{signUpError.password.message}
											</p>
										)}

										<div className="flex items-center">
											<input
												type="checkbox"
												{...registerSignUp("agreeTerm", {
													required:
														"You must agree to the terms and conditions",
												})}
												className="mr-2"
											/>
											<label className="text-sm text-gray-700">
												I agree to the terms & conditions
											</label>
										</div>
										<Button
											className="cursor-pointer w-full font-bold select-none"
											type="submit"
										>
											{signupLoading ? (
												<Loader2 className="animate-spin mr-2" />
											) : (
												"Sign Up"
											)}
										</Button>
									</form>
								</TabsContent>
								<TabsContent value="forgot">
									{!forgotPasswordSuccess ? (
										<form
											className="space-y-4"
											onSubmit={handleForgotPasswordSubmit(
												handleForgotPassword
											)}
										>
											<div className="relative">
												<Input
													{...registerForgotPassword("email", {
														required: "Email is required",
													})}
													placeholder="Email"
													type="email"
													className="pl-10"
												/>
												<Mail
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
													size={20}
												/>
											</div>
											{forgotPasswordError.email && (
												<p className="text-red-500 text-sm">
													{forgotPasswordError.email.message}
												</p>
											)}

											<Button
												className="cursor-pointer w-full font-bold select-none"
												type="submit"
											>
												{forgotPasswordLoading ? (
													<Loader2 className="animate-spin mr-2" />
												) : (
													"Send Reset Link"
												)}
											</Button>
										</form>
									) : (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-center space-y-4"
										>
											<CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
											<h3 className="text-xl font-semibold text-gray-700">
												Reset Link Sent
											</h3>
											<p className="text-gray-500">
												We've sent a password reset link to your email.
												Please check your inbox and follow the instructions
												to reset your password.
											</p>
											<Button
												onClick={() => setForgotPasswordSuccess(false)}
												className="w-full "
											>
												Send Another Link to Email
											</Button>
										</motion.div>
									)}
								</TabsContent>
							</motion.div>
						</AnimatePresence>
					</Tabs>
					<p className="text-sm text-center text-gray-600 mt-2">
						By clicking "agree", you agree to our{" "}
						<Link href="/terms-of-use" className="text-blue-500 hover:underline">
							Terms of Use,{" "}
						</Link>
						<Link href="/privacy-policy" className="text-blue-500 hover:underline">
							Privacy Policy
						</Link>
					</p>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default AuthPage;
