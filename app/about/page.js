import React from "react";
import Link from "next/link";
import Footer from "@/shared/ui/Footer";

export default function About() {
  const team = [
    { name: "Adham Ahmed", role: "Founder & Engineer", bio: "Building delightful, tiny utilities that save time and reduce friction for people who work with PDFs.", twitter: "https://twitter.com" },
    { name: "Lina Hassan", role: "Product Designer", bio: "Designs simple, focused interfaces and delightful interactions.", twitter: "https://twitter.com" },
    { name: "Sam Ortiz", role: "Frontend Engineer", bio: "Turns designs into responsive, accessible UI and maintains the component library.", twitter: "https://twitter.com" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">About PDF-tools</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Small, focused utilities that help you inspect, edit and transform PDFs quickly — no heavy suites,
            just the right tool for the job.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Our mission</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We believe productivity comes from removing friction. PDF workflows are notoriously clunky — our
              goal is to provide tiny, reliable tools that solve a single job well. Whether you need to compress,
              split, merge or extract text, PDF-tools aims to make that task fast and predictable.
            </p>

            <h3 className="mt-6 text-lg font-medium text-gray-900">How we work</h3>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>• Ship small, test often — iterate quickly on tiny improvements.</li>
              <li>• Stay focused — each tool solves one problem and does it well.</li>
              <li>• Respect privacy — we design for local-first and minimal data exposure.</li>
            </ul>
          </div>

          <div className="rounded-lg bg-linear-to-br from-white to-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Why PDF-tools?</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Many teams tolerate slow manual steps because a single all-in-one app feels safer. We prove an
              alternative: focused tools that are fast to load, easy to automate, and simple to understand.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">✓</div>
                <div>
                  <p className="font-medium text-gray-900">Reliable</p>
                  <p className="text-sm text-gray-600">Tools that behave predictably under load and edge cases.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">⚡</div>
                <div>
                  <p className="font-medium text-gray-900">Fast</p>
                  <p className="text-sm text-gray-600">Optimized for quick results — no bloat, no waiting.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">🔒</div>
                <div>
                  <p className="font-medium text-gray-900">Private</p>
                  <p className="text-sm text-gray-600">Minimal telemetry and clear privacy choices.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">Meet the team</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">{m.name.split(" ")[0][0]}</div>
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{m.bio}</p>
                <div className="mt-3">
                  <Link href={m.twitter} className="text-sm text-teal-600 hover:underline">Follow</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

  <section className="mt-12 rounded-lg bg-linear-to-r from-teal-600 to-indigo-600 p-8 text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold">Want to help improve PDF-tools?</h3>
            <p className="mt-3 text-white/90">We welcome contributions, feedback, and bug reports. Open an issue or drop us a note.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="inline-block rounded bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">Explore tools</Link>
              <a href="mailto:hello@example.com" className="inline-block rounded bg-white px-4 py-2 text-sm font-medium text-teal-700">Contact us</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
