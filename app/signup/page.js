"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
	const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", accept: false });
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const validate = () => {
		const e = {};
		if (!form.name.trim()) e.name = "Name is required";
		if (!form.email.trim()) e.email = "Email is required";
		else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
		if (!form.password) e.password = "Password is required";
		else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
		if (form.password !== form.confirm) e.confirm = "Passwords do not match";
		if (!form.accept) e.accept = "You must accept the privacy policy";
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
			await new Promise((r) => setTimeout(r, 900));
			console.log("Signup payload:", { name: form.name, email: form.email });
			setSuccess(true);
			setForm({ name: "", email: "", password: "", confirm: "", accept: false });
		} catch (err) {
			setErrors({ form: "Something went wrong. Please try again." });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
			<div className="w-full max-w-lg">
				<div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
					<h1 className="text-2xl font-extrabold text-gray-900">Create account</h1>
					<p className="mt-2 text-sm text-gray-600">Sign up to unlock premium features and sync your settings.</p>

					{success && (
						<div className="mt-4 rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-800">
							Account created (demo). Check console for payload.
						</div>
					)}

					{errors.form && (
						<div className="mt-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800">{errors.form}</div>
					)}

					<form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
						<div>
							<label className="block text-sm font-medium text-gray-700">Full name</label>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-200'}`}
								placeholder="Your full name"
								aria-invalid={!!errors.name}
								aria-describedby={errors.name ? 'name-error' : undefined}
							/>
							{errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
						</div>

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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Password</label>
								<input
									name="password"
									value={form.password}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-200'}`}
									type="password"
									placeholder="At least 8 characters"
									aria-invalid={!!errors.password}
									aria-describedby={errors.password ? 'password-error' : undefined}
								/>
								{errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Confirm</label>
								<input
									name="confirm"
									value={form.confirm}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.confirm ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-200'}`}
									type="password"
									placeholder="Repeat password"
									aria-invalid={!!errors.confirm}
									aria-describedby={errors.confirm ? 'confirm-error' : undefined}
								/>
								{errors.confirm && <p id="confirm-error" className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
							</div>
						</div>

						<div className="flex items-start gap-2">
							<input id="accept" name="accept" type="checkbox" checked={form.accept} onChange={handleChange} className="mt-1 h-4 w-4 rounded text-teal-600 border-gray-300" />
							<label htmlFor="accept" className="text-sm text-gray-700">I agree to the <a href="/privacy" className="text-teal-600 underline">privacy policy</a></label>
						</div>
						{errors.accept && <p className="mt-1 text-xs text-red-600">{errors.accept}</p>}

						<div>
							<button
								type="submit"
								disabled={submitting}
								className="w-full inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
							>
								{submitting ? 'Creating...' : 'Create account'}
							</button>
						</div>
					</form>

					<p className="mt-4 text-sm text-gray-600">Already have an account? <Link href="/" className="text-teal-600 underline">Sign in</Link></p>
				</div>
			</div>
		</div>
	);
}

