"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ToolList from "@/features/tools/constants/tools";
import ToolCard from "@/features/tools/ui/ToolCard";

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomeToolsSection({ query = "" }) {
  const premiumTools = useMemo(
    () => ToolList.filter((tool) => tool.tier === "premium"),
    []
  );
  const freemiumTools = useMemo(
    () => ToolList.filter((tool) => tool.tier !== "premium"),
    []
  );

  const filteredPremium = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return premiumTools;
    return premiumTools.filter((t) => {
      const haystack = `${t.title} ${t.description} ${t.href}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, premiumTools]);

  const filteredFreemium = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return freemiumTools;
    return freemiumTools.filter((t) => {
      const haystack = `${t.title} ${t.description} ${t.href}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, freemiumTools]);

  const premiumFeatured = useMemo(
    () => filteredPremium.filter((tool) => tool.featured),
    [filteredPremium]
  );
  const premiumStandard = useMemo(
    () => filteredPremium.filter((tool) => !tool.featured),
    [filteredPremium]
  );

  const hasQuery = query.trim().length > 0;
  const noResults =
    hasQuery && filteredPremium.length === 0 && filteredFreemium.length === 0;

  const showPremium = !hasQuery || filteredPremium.length > 0;
  const showFreemium = !hasQuery || filteredFreemium.length > 0;

  return (
    <>
      {showPremium && (
        <section id="premium" className="relative py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_55%)]"
          />
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                  Premium First
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-[var(--font-display)] text-slate-900">
                  Downloads and conversions with a premium edge
                </h2>
                <p className="mt-2 text-sm md:text-base text-[color:var(--muted)] max-w-2xl">
                  {hasQuery
                    ? "Premium matches based on your search."
                    : "Start with the high-touch tools: video downloads and image-ready PDFs."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {filteredPremium.length}{" "}
                  {filteredPremium.length === 1 ? "tool" : "tools"}
                </span>
                <Link
                  href="/tools"
                  className="inline-flex items-center rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:border-amber-300 hover:text-amber-800"
                >
                  View all tools
                </Link>
              </div>
            </div>

            {premiumFeatured.length > 0 && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {premiumFeatured.map((tool) => (
                  <motion.div key={tool.title} variants={itemVariants}>
                    <ToolCard
                      icon={tool.icon}
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                      color={tool.color}
                      tier={tool.tier}
                      featured={tool.featured}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {premiumStandard.length > 0 && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-8 flex justify-center"
              >
                <div className="w-full max-w-lg">
                  {premiumStandard.map((tool) => (
                    <motion.div key={tool.title} variants={itemVariants}>
                      <ToolCard
                        icon={tool.icon}
                        title={tool.title}
                        description={tool.description}
                        href={tool.href}
                        color={tool.color}
                        tier={tool.tier}
                        featured={tool.featured}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {showFreemium && (
        <section id="freemium" className="relative py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(45,212,191,0.2),_transparent_60%)]"
          />
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                  Freemium Essentials
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-[var(--font-display)] text-slate-900">
                  Everyday PDF tasks, ready in a click
                </h2>
                <p className="mt-2 text-sm md:text-base text-[color:var(--muted)] max-w-2xl">
                  {hasQuery
                    ? "Freemium matches based on your search."
                    : "Fast conversions and edits without the friction."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {filteredFreemium.length}{" "}
                  {filteredFreemium.length === 1 ? "tool" : "tools"}
                </span>
                <Link
                  href="/tools"
                  className="inline-flex items-center rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 hover:border-teal-300 hover:text-teal-800"
                >
                  Browse all tools
                </Link>
              </div>
            </div>

            <motion.div
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredFreemium.map((tool) => (
                <motion.div key={tool.title} variants={itemVariants}>
                  <ToolCard
                    icon={tool.icon}
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                    color={tool.color}
                    tier={tool.tier}
                    featured={tool.featured}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {noResults && (
        <section className="pb-10">
          <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-16">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No tools match “{query}”. Try a different search.
            </div>
          </div>
        </section>
      )}
    </>
  );
}
