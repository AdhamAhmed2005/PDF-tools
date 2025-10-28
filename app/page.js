"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import ToolList from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import Hero from "@/components/Hero";
import Link from "next/link";
import Benifits from "@/components/Benifits";
import ClientReview from "@/components/ClientReview";

export default function Home() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ToolList;
    return ToolList.filter((t) => {
      const haystack = `${t.title} ${t.description} ${t.href}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  // Only show a small curated set on the landing page when there's no search query
  const featuredTools = useMemo(() => ToolList.slice(0, 8), []);
  const displayTools = query ? filteredTools : featuredTools;

  return (
    <div className="min-h-screen bg-white">
      <Hero query={query} setQuery={setQuery} />

      <Benifits/>

      <section id="tools" className="pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Tools
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {query ? "Search results" : "Popular tools"}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <p className="text-sm text-gray-500">
                {displayTools.length} {displayTools.length === 1 ? "tool" : "tools"}
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-700"
              >
                Browse all tools
              </Link>
            </div>
          </div>

          {displayTools.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No tools match “{query}”. Try a different search.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {displayTools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                    type: "spring",
                  }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className="w-full sm:w-72 md:w-64 lg:w-56 xl:w-48"
                >
                  <ToolCard
                    icon={tool.icon}
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                    color={tool.color}
                  />
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-6 md:hidden">
            <Link
              href="/tools"
              className="block w-full text-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-700"
            >
              Browse all tools
            </Link>
          </div>
        </div>
      </section>
<ClientReview/>
      <Footer />
    </div>
  );
}
