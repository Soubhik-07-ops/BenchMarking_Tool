"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Pricing() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col">
            {/* Top section with centered content */}
            <div className="flex-grow flex flex-col items-center">
                <Navbar />
                <div className="text-center mt-24">
                    <h1 className="text-4xl font-bold text-purple-800">Pricing Plans</h1>
                    <p className="text-gray-600 mt-2">Choose a plan that fits your needs.</p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-16">
                    {/* Free Plan */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Free Plan</h2>
                        <p className="text-gray-500">For Beginners & Casual Users</p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li>✅ Upload up to <b>2 models/day</b></li>
                            <li>✅ Basic performance metrics</li>
                            <li>✅ Simple visualizations</li>
                            <li>✅ Compare up to <b>2 models</b></li>
                            <li>🚫 No advanced analysis or reports</li>
                        </ul>
                        <p className="text-xl font-bold mt-4">$0 <span className="text-gray-500">/ Free Forever</span></p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Pro Plan</h2>
                        <p className="text-gray-500">For Researchers & Professionals</p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li>✅ Upload <b>unlimited models</b></li>
                            <li>✅ Advanced benchmarking</li>
                            <li>✅ Compare up to <b>5 models</b></li>
                            <li>✅ Downloadable PDF reports</li>
                            <li>✅ Priority support & faster processing</li>
                        </ul>
                        <p className="text-xl font-bold mt-4">$19 <span className="text-gray-500">/ month</span></p>
                        <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Enterprise Plan</h2>
                        <p className="text-gray-500">For Teams & Organizations</p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li>✅ Custom benchmarking metrics</li>
                            <li>✅ Unlimited model comparisons</li>
                            <li>✅ API access & real-time monitoring</li>
                            <li>✅ Team collaboration & shared dashboards</li>
                            <li>✅ Dedicated account manager</li>
                        </ul>
                        <p className="text-xl font-bold mt-4">Custom Pricing</p>
                        <button
                            onClick={() => router.push("/contact-us")}
                            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="text-2xl font-bold text-gray-800">Why Choose Us?</h3>
                    <ul className="mt-4 text-gray-600 space-y-2">
                        <li>✔ <b>Fast & Reliable</b> – Get benchmarking results in seconds</li>
                        <li>✔ <b>Easy to Use</b> – Simple drag-and-drop upload</li>
                        <li>✔ <b>Comprehensive Metrics</b> – See everything from accuracy to hardware efficiency</li>
                        <li>✔ <b>Data Security</b> – Your models stay private and secure</li>
                    </ul>
                </div>

                <div className="mt-12 mb-10">
                    <button
                        onClick={() => router.push("/upload")}
                        className="p-[3px] relative inline-block cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
                        <div className="px-8 py-3 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                            Start Benchmarking Now!
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer now outside centered content */}
            <Footer />
        </div>
    );
}
