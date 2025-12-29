"use client";

import React, { useState } from "react";
import Hero from "@/features/home/ui/Hero";
import HomeToolsSection from "@/features/home/ui/HomeToolsSection";

export default function HomePageClient() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Hero query={query} setQuery={setQuery} />
      <HomeToolsSection query={query} />
    </>
  );
}
