"use client"

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Clear any previous errors

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if(result?.error){
            console.log(result.error);
            // Set user-friendly error messages
            if (result.error === "CredentialsSignin") {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
            setIsLoading(false);
        } else {
            router.push("/");
        }
    };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center px-4 py-8 overflow-hidden no-scroll">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-md w-full">
            {/* Login Card */}
            
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your account to continue</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSumit} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
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
                                placeholder='Enter your password' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                        
                        {/* Forgot Password Link */}
                        <div className="mt-2 text-right">
                            <Link 
                                href="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button 
                        type='submit'
                        disabled={isLoading}
                        className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>
                
                {/* Register Link */}
                <div className="mt-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">Don't have an account?</span>
                        </div>
                    </div>
                    
                    <Link 
                        href="/register"
                        className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Create an account</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage