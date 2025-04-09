import React from "react";
import Navbar from "../components/Navbar";
import BlurText from "../components/BlurText";
import Footer from '../components/Footer';

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col">
            {/* Content wrapper */}
            <div className="flex-grow flex flex-col items-center">
                <Navbar />

                {/* Page Header */}
                <div className="mt-32 text-center">
                    <BlurText
                        text="Get in Touch with AI.Benchmarking"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-4xl font-bold text-gray-900"
                    />
                    <p className="text-gray-600 mt-2">We'd love to hear from you. Let's connect!</p>
                </div>

                {/* Contact Form */}
                <div className="mt-10 mb-20 bg-white shadow-lg rounded-2xl p-8 border border-gray-200 w-full max-w-lg">
                    <form className="flex flex-col space-y-4">
                        <div>
                            <label className="text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium">Message</label>
                            <textarea
                                rows={4}
                                placeholder="Type your message..."
                                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="relative p-[3px] w-full rounded-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
                            <div className="px-8 py-3 bg-black text-white relative group transition duration-200 rounded-lg hover:bg-transparent hover:text-black">
                                Send Message
                            </div>
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer full width */}
            <Footer />
        </div>
    );
}
