// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // adjust if you're using different folders
	],
	theme: {
		extend: {
			animation: {
				"ping-slow": "ping 1.5s cubic-bezier(0, 0, 0.5, 1) infinite",
			},
			colors: {
				testred: "#ff0000",
			},
		},
	},
	plugins: [],
};

export default config;
