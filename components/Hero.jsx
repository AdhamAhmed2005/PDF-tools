"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Hero = ({ query, setQuery }) => {
  return (
    <section className="relative overflow-hidden">
      {/* subtle background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-teal-50 via-white to-white"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Work with PDFs faster
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Private, fast, and free tools to merge, split, convert, and secure
            PDFs in your browser.
          </p>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools (e.g., merge, compress, sign)"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/tools/merge-pdf"
                className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 hover:border-teal-300 hover:bg-teal-100"
              >
                Merge PDF
              </Link>
              <Link
                href="/tools/split-pdf"
                className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 hover:border-orange-300 hover:bg-orange-100"
              >
                Split PDF
              </Link>
              <Link
                href="/tools/compress-pdf"
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:border-blue-300 hover:bg-blue-100"
              >
                Compress PDF
              </Link>
              <a
                href="#tools"
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700"
              >
                Browse all
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;