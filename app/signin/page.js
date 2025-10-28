
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SigninPage() {
	const [form, setForm] = useState({ email: "", password: "", remember: false });
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const validate = () => {
		const e = {};
		if (!form.email.trim()) e.email = "Email is required";
		else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
		if (!form.password) e.password = "Password is required";
		return e;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const eobj = validate();
		setErrors(eobj);
		if (Object.keys(eobj).length) return;
		setSubmitting(true);
		try {
			// Placeholder: swap with real auth call
			await new Promise((r) => setTimeout(r, 700));
			console.log("Signin payload:", { email: form.email, remember: form.remember });
			setSuccess(true);
			setForm({ email: "", password: "", remember: false });
		} catch (err) {
			setErrors({ form: "Something went wrong. Please try again." });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
			<div className="w-full max-w-md">
				<div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
					<h1 className="text-2xl font-extrabold text-gray-900">Sign in</h1>
					<p className="mt-2 text-sm text-gray-600">Welcome back — sign in to access your tools and settings.</p>

					{success && (
						<div className="mt-4 rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-800">
							Signed in (demo). Check console for payload.
						</div>
					)}

					{errors.form && (
						<div className="mt-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800">{errors.form}</div>
					)}

					<form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input
								name="email"
								value={form.email}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-200'}`}
								placeholder="you@example.com"
								type="email"
								aria-invalid={!!errors.email}
								aria-describedby={errors.email ? 'email-error' : undefined}
							/>
							{errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input
								name="password"
								value={form.password}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-200'}`}
								type="password"
								placeholder="Your password"
								aria-invalid={!!errors.password}
								aria-describedby={errors.password ? 'password-error' : undefined}
							/>
							{errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm text-gray-700">
								<input name="remember" type="checkbox" checked={form.remember} onChange={handleChange} className="h-4 w-4 rounded text-teal-600 border-gray-300" />
								Remember me
							</label>
							<Link href="/" className="text-sm text-teal-600 underline">Forgot password?</Link>
						</div>

						<div>
							<button
								type="submit"
								disabled={submitting}
								className="w-full inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
							>
								{submitting ? 'Signing in...' : 'Sign in'}
							</button>
						</div>
					</form>

					<p className="mt-4 text-sm text-gray-600">Don’t have an account? <Link href="/signup" className="text-teal-600 underline">Create one</Link></p>
				</div>
			</div>
		</div>
	);
}
