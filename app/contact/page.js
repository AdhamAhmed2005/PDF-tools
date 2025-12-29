import React from "react";
import Footer from "@/shared/ui/Footer";
import ContactForm from "@/features/contact/ui/ContactForm";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Contact us</h1>
          <p className="mt-3 text-gray-600">
            Have a question, feedback, or a feature request? Send us a message and we&apos;ll get back to you.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Get in touch</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We read every message. For quick questions, try the FAQ or browse the tools — your answer might
              already be there. Otherwise, send us a note below and include as much context as you can.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">✉️</div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">hello@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center">🐙</div>
                <div>
                  <p className="font-medium text-gray-900">Open source</p>
                  <p className="text-sm text-gray-600">Contributions and issues on <Link href="#" className="text-teal-600 underline">GitHub</Link>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-none h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">💬</div>
                <div>
                  <p className="font-medium text-gray-900">Support</p>
                  <p className="text-sm text-gray-600">We aim to reply within 1–2 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
