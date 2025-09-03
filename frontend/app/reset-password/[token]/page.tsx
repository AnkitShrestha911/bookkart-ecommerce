"use client";

import { useResetPasswordMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";

interface ResetPasswordFormData {
	token: string;
	newPassword: string;
	confirmPassword: string;
}

const Page = () => {
	const { token } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();
	const [resetPassword] = useResetPasswordMutation();
  const isDialogOpen = useSelector((state:RootState) => state.user.isLoginDialogOpen);
	const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
	const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit: handleResetPasswordSubmit,
		formState: { errors: resetError },
	} = useForm<ResetPasswordFormData>();

	const onSubmitResetFrom = async (data: ResetPasswordFormData) => {
    
		if (!data.newPassword.trim() || !data.confirmPassword.trim()) {
			toast.error("Password must not be empty");
			return;
		}
		if (data.newPassword !== data.confirmPassword) {
			toast.error("Password do not match");
			return;
		}

		try {
      setResetPasswordLoading(true);
			await resetPassword({ token, newPassword: data.newPassword }).unwrap();
			setResetPasswordSuccess(true);
			toast.success("Password Reset Successfully");
		} catch (e) {
			console.log(e);
			toast.error("Failed to reset password");
		}finally{
      setResetPasswordLoading(false);
    }
	};

  useEffect(() => {
    if(isDialogOpen) {
      dispatch(toggleLoginDialog());
    }
  },[])

	return (
		<div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-[50vh]">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
				transition={{ duration: 0.5 }}
			>
				<h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
					Reset Your Password
				</h2>
				{!resetPasswordSuccess ? (
					<form onSubmit={handleResetPasswordSubmit(onSubmitResetFrom)}>
						<div className="relative mb-4">
							<Input
								{...register("newPassword", {
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
						{resetError.newPassword && (
							<p className="text-red-500 text-sm">{resetError.newPassword.message}</p>
						)}

						<div className="relative mb-5">
							<Input
								{...register("confirmPassword", {
									required: "Confirm password is required",
								})}
								placeholder="Confirm Password"
								type={showPassword ? "text" : "password"}
								className="pl-10"
							/>
						</div>
						{resetError.confirmPassword && (
							<p className="text-red-500 text-sm">
								{resetError.confirmPassword.message}
							</p>
						)}

						<Button
							className="cursor-pointer w-full font-bold select-none"
							type="submit"
						>
							{resetPasswordLoading ? (
								<Loader2 className="animate-spin mr-2" />
							) : (
								"Reset Password"
							)}
						</Button>
					</form>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center space-y-4"
						transition={{ duration: 0.5 }}
					>
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
						<h2 className="text-2xl font-semibold text-gray-800 mb-2">
							Password Reset Successfully
						</h2>
						<p>
							Your password has been reset succesfully.Now you can login with new
							password
						</p>
						<Button
							onClick={() => dispatch(toggleLoginDialog())}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-300 ease-in-out mt-4 cursor-pointer"
						>
							Go To Login
						</Button>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default Page;
