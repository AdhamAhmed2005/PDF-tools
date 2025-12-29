'use client';

import { useEffect } from "react";
import Link from "next/link";
import { signupSchema } from "@/shared/validation/auth-schemas";
import { useValidatedForm } from "@/shared/hooks/useValidatedForm";
import { useAuthAction } from "@/features/auth/hooks/useAuthAction";

export default function SignupForm() {
  const { form, errors, setField, validate, reset } = useValidatedForm(
    { name: "", email: "", password: "", confirm: "", accept: false },
    signupSchema
  );
  const { submit, submitting, success, formError, setFormError, resetSuccess } = useAuthAction({
    endpoint: "/api/auth/signup",
  });

  useEffect(() => {
    if (success) {
      reset();
    }
  }, [reset, success]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (formError) {
      setFormError("");
    }
    if (success) {
      resetSuccess();
    }
    setField(name, type === "checkbox" ? checked : value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = validate();
    if (!result.success) {
      return;
    }
    await submit({
      username: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });
  };

  return (
    <>
      {success && (
        <div className="mt-4 rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-800">
          Account created (demo). Check console for payload.
        </div>
      )}

      {formError && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800">{formError}</div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-teal-200"
            }`}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-teal-200"
            }`}
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
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
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-teal-200"
              }`}
              type="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm</label>
            <input
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.confirm ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-teal-200"
              }`}
              type="password"
              placeholder="Repeat password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? "confirm-error" : undefined}
            />
            {errors.confirm && <p id="confirm-error" className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            id="accept"
            name="accept"
            type="checkbox"
            checked={form.accept}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded text-teal-600 border-gray-300"
          />
          <label htmlFor="accept" className="text-sm text-gray-700">
            I agree to the <a href="/privacy" className="text-teal-600 underline">privacy policy</a>
          </label>
        </div>
        {errors.accept && <p className="mt-1 text-xs text-red-600">{errors.accept}</p>}

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link href="/" className="text-teal-600 underline">Sign in</Link>
      </p>
    </>
  );
}
