"use client"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        department: "",
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
        if (!formData.department) errs.department = "Department is required"

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
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
            <div className="max-w-sm w-full p-8 bg-white border border-gray-200 rounded-lg shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Sign Up</h2>

                {errors.general && (
                    <div className="mb-4 text-sm text-red-600">{errors.general}</div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-300"
                                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`bg-gray-50 border ${errors.department ? "border-red-500" : "border-gray-300"
                                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="e.g. Computer Science"
                        />
                        {errors.department && (
                            <p className="mt-1 text-xs text-red-600">{errors.department}</p>
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
                                onChange={handleChange}
                                className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"
                                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
