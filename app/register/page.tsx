"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Mail, Lock, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                setError("Server error. Please try again.");
                return;
            }

            console.log("Response status:", res.status);
            console.log("Response data:", data);

            // Handle successful registration (status 201)
            if (res.status === 201 && data.message === "User registered successfully") {
                console.log("Registration successful:", data);
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
                return;
            }

            // Handle all error cases (400, 409, 500, etc.)
            if (!res.ok) {
                console.log("Registration failed with status:", res.status);
                setError(data?.error || data?.message || `Registration failed (${res.status})`);
                return;
            }

            // Fallback for unexpected success responses
            console.log("Unexpected response format:", data);
            setError("Unexpected server response. Please try again.");

        } catch (error) {
            console.error("Network error:", error);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen bg-gray-900 flex items-center justify-center px-4 py-8 overflow-hidden no-scroll">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            
            <div className="relative max-w-md w-full">
                {/* Register Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400">Join us and start your journey</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-green-300">{success}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder='Enter your email address' 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                        
                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder='Create a password (min 6 characters)' 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                        
                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder='Confirm your password' 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type='submit'
                            disabled={isLoading}
                            className="cursor-pointer w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>
                    
                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">Already have an account?</span>
                            </div>
                        </div>
                        
                        <Link 
                            href="/login"
                            className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign in instead</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage