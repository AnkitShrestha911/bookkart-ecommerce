// components/Loader.tsx
import React from "react";

export default function PageLoader() {
	return (
		<div className="min-h-dvh">
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-xs">
				{/* Loader Dots */}
				<div className="flex space-x-4">
					<span className="dot bg-blue-500 animate-grow delay-[0ms]" />
					<span className="dot bg-purple-500 animate-grow delay-[200ms]" />
					<span className="dot bg-pink-500 animate-grow delay-[400ms]" />
				</div>
			</div>
		</div>
	);
}
