import React from "react";
import FileUploader from "../components/UploadBox";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

export default function Upload() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 w-full flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Upload Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-23 py-25 animate-fadeIn">
                <div className="bg-white/40 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-4xl transition-all duration-300">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight drop-shadow-md">
                        🚀 Benchmark Your AI Models
                    </h2>

                    <p className="text-center text-sm sm:text-base text-gray-500 mb-6 max-w-2xl mx-auto">
                        Compare the performance of two AI models on their respective datasets using our intuitive drag-and-drop uploader. View accuracy, latency, memory usage, and more.
                    </p>
                    <h3 className="text-center text-sm sm:text-base mb-6 max-w-2xl mx-auto">Your model and dataset should be under 500mb</h3>

                    <FileUploader />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
}
