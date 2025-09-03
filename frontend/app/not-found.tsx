// app/not-found.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center  min-h-screen text-center px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md w-full space-y-6">
        <Image
          src="https://i.imgur.com/qIufhof.png"
          alt="Funny 404 Illustration"
          width={300}
          height={300}
          className="mx-auto"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-purple-700">Oops! Page not found</h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Looks like you've ventured into uncharted territory. 🧭
        </p>

        <Link href="/">
          <button className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg transition-all duration-200 shadow-md">
            🏠 Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
