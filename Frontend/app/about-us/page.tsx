import React from "react";
import Navbar from "../components/Navbar";
import BlurText from "../components/BlurText";
import Footer from "../components/Footer";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col">
            {/* Page content container */}
            <div className="flex-grow flex flex-col items-center">
                <Navbar /> {/* Navbar at the top */}

                {/* Hero Section */}
                <div className="mt-24 text-center px-6 md:px-16 max-w-4xl">
                    <BlurText
                        text="Empowering AI Developers with Fast & Reliable Benchmarking"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-4xl font-bold text-gray-900"
                    />
                    <p className="text-lg text-gray-600 mt-4">
                        AI.Benchmarking is dedicated to providing an easy-to-use, powerful platform for testing and comparing AI models. Our mission is to help developers and researchers optimize performance effortlessly.
                    </p>
                </div>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 max-w-6xl">
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">🚀 Speed & Efficiency</h2>
                        <p className="text-gray-600 mt-2">
                            Get AI model benchmarks in seconds with accurate performance metrics.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">📊 Data-Driven Insights</h2>
                        <p className="text-gray-600 mt-2">
                            Visualize key model performance metrics with interactive graphs.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">🔬 Research & Innovation</h2>
                        <p className="text-gray-600 mt-2">
                            AI developers and researchers can compare and refine their models with ease.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">🔒 Security & Privacy</h2>
                        <p className="text-gray-600 mt-2">
                            We ensure that all uploaded models remain confidential and secure.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 mb-10">
                    <a href="/pricing" className="p-[3px] relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
                        <div className="px-8 py-3 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                            Learn More About AI.Benchmarking
                        </div>
                    </a>
                </div>
            </div>

            {/* Footer outside centered content for full width */}
            <Footer />
        </div>
    );
}
