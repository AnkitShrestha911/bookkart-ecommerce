"use client";

import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const page: React.FC = () => {
	const { token } = useParams();
	const dispatch = useDispatch();
	const isDialogOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);

	const [verifyEmailMutation] = useVerifyEmailMutation();
	const isEmailVerified = useSelector((state: RootState) => state.user.isEmailVerified);
	const router = useRouter();

	const [verificationStatus, setVerificationStatus] = useState<
		"loading" | "success" | "alreadyVerified" | "failed"
	>("loading");

	useEffect(() => {
		if (isDialogOpen) {
			dispatch(toggleLoginDialog());
		}
	}, []);

	useEffect(() => {
		if (isEmailVerified) {
			setVerificationStatus("alreadyVerified");
			return;
		}

		const verify = async () => {
			try {
				const result = await verifyEmailMutation(token).unwrap();

				if (result.success) {
					dispatch(setEmailVerified(true));
					setVerificationStatus("success");
					dispatch(authStatus());
					toast.success("Email Verified Successfully.", { id: "verify-success" });
					setTimeout(() => {
						window.location.href = "/";
					}, 3000);
				}
			} catch (error: any) {
				setVerificationStatus("failed");
				setTimeout(() => {
					window.location.href = "/";
				}, 3000);
			}
		};

		if (typeof token === "string" && token.trim() !== "") {
			console.log("Send token: ", token);
			verify();
		}
	}, [token]);

	return (
		<div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-[50vh]">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
				transition={{ duration: 0.5 }}
			>
				{verificationStatus === "loading" && (
					<div className="flex flex-col items-center">
						<Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
						<h2 className="text-2xl font-semibold text-gray-800 mb-2">
							Verifying Your Email
						</h2>
						<p>Please wait we are verifying your email...</p>
					</div>
				)}

				{verificationStatus === "success" && (
					<div>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
							transition={{ type: "spring", stiffness: 200, damping: 10 }}
						>
							<CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold text-gray-800 mb-2">
								Email Verified
							</h2>
							<p>
								Your Email has been successfully verified. You'll be redirecting to
								the homepage shortly.
							</p>
						</motion.div>
					</div>
				)}

				{verificationStatus === "alreadyVerified" && (
					<div>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
							transition={{ type: "spring", stiffness: 200, damping: 10 }}
						>
							<CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold text-gray-800 mb-2">
								Email Already Verified
							</h2>
							<p>Your Email is already verified.</p>
							<Button
								onClick={() => router.push("/")}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-300 ease-in-out mt-4 cursor-pointer"
							>
								Go To Homepage
							</Button>
						</motion.div>
					</div>
				)}

				{verificationStatus === "failed" && (
					<div>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
							transition={{ type: "spring", stiffness: 200, damping: 10 }}
						>
							<XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold text-gray-800 mb-2">
								Email Verification Failed
							</h2>
							<p>Your email verification link has been expired!</p>
						</motion.div>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default page;
