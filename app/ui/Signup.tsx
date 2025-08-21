"use client"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BUTTON_PRIMARY, INPUT } from "./constants";

export default function Signup() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        dept_name: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }

    const validate = () => {
        const errs: { [key: string]: string } = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

        if (!formData.email.includes("@")) errs.email = "Invalid email"
        if (!passwordRegex.test(formData.password))
            errs.password =
                "Password must be 8+ chars, with uppercase, lowercase, number & special character"
        if (!formData.dept_name) errs.dept_name = "Department is required"

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (res.ok) {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("department_id", data.department_id);
                window.location.href = "/department";
            }
            if (!res.ok) {
                setErrors(data.errors || { general: "Signup failed" })
                return
            }

            // redirect or show success message
        } catch (err) {
            setErrors({ general: "Something went wrong" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Sign Up</h2>

                {errors.general && (
                    <div className="mb-4 text-sm text-red-600">{errors.general}</div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            title="Enter your email address"
                            onChange={handleChange}
                            className={`bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-300"
                                } ${INPUT}`}
                            placeholder="name@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Department
                        </label>
                        <input
                            type="text"
                            name="dept_name"
                            value={formData.dept_name}
                            title="Enter your department name"
                            onChange={handleChange}
                            className={`bg-gray-50 border ${errors.dept_name ? "border-red-500" : "border-gray-300"
                                } ${INPUT}`}
                            placeholder="e.g. Computer Science"
                        />
                        {errors.dept_name && (
                            <p className="mt-1 text-xs text-red-600">{errors.dept_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                title="Enter your password"
                                onChange={handleChange}
                                className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"
                                    } ${INPUT}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                title="Toggle password visibility"
                                className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={BUTTON_PRIMARY}
                        title="Create your account"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/department/login" className="text-emerald-600 hover:underline">
                        Login here
                    </a>
                </div>
            </div>
        </div>
    );
}
