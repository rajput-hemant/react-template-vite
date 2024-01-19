/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7tt98gb9eZy
 */

import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="layout flex min-h-screen flex-col items-center justify-center space-y-6 bg-[#141414] text-center text-white">
      <svg
        className="size-24 text-red-500"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>

      <h1 className="text-5xl font-bold text-gray-100">404</h1>

      <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>

      <p className="text-gray-400">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </p>
      <Link
        className="mt-8 rounded-md border border-zinc-700 px-4 py-2 hover:bg-white/10"
        to="/"
      >
        Return to Home
      </Link>
    </div>
  );
}
