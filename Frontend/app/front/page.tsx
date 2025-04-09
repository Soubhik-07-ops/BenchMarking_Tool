
import React from "react";
import Navbar from "../components/Navbar";
import BlurText from "../components/BlurText";
import Footer from "../components/Footer";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import AITextAssistant from "../components/Ai_assitant";
import Testimonials from "../components/Testimonials";

export default function Front() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full flex flex-col items-center text-center py-20 px-6 md:py-32">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
          <BlurText
            text="AI Model Benchmarking"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-6xl font-bold"
          />
          <span className="text-purple-400"> Simplified.</span>
        </h1>
        <p className="text-lg mt-4 max-w-2xl text-gray-300">
          Analyze, compare, and optimize AI models effortlessly with our
          one-click benchmarking platform.
        </p>

        {/* Start Benchmarking Button */}
        <a href="/upload" className="p-[3px] relative mt-6 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
          <div className="px-8 py-3 bg-black rounded-[6px] relative flex items-center space-x-2 text-lg font-semibold transition duration-200 text-white hover:bg-transparent">
            <span>Start Benchmarking</span>
            <FaArrowRight />
          </div>
        </a>

        {/* Video with White Blurred Glow Behind */}
        <div className="mt-10 w-full max-w-5xl relative flex justify-center items-center">
          {/* Glow behind the video */}
          <div className="absolute w-[90%] h-[100%] blur-2xl bg-white/20 rounded-3xl z-0" />

          {/* Actual video */}
          <video
            src="/ai-video.mp4" // Ensure this is in the public folder
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 rounded-xl shadow-2xl"
          />
        </div>
      </div>
      <AITextAssistant />
      {/* Features Section */}
      <div className="py-20 px-6 md:px-16 bg-gradient-to-b from-purple-100 to-white w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why Choose AI.Benchmarking?
        </h2>
        <p className="text-lg text-gray-600 text-center mt-2">
          Speed, Accuracy, and Security—all in one platform.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">⚡ Fast Processing</h3>
            <p className="mt-2 text-gray-600">
              Get benchmarking results within seconds.
            </p>
          </div>
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">📊 Comprehensive Metrics</h3>
            <p className="mt-2 text-gray-600">
              Analyze accuracy, speed, and efficiency.
            </p>
          </div>
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">🔒 Secure & Private</h3>
            <p className="mt-2 text-gray-600">
              Your AI models remain safe and confidential.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 md:px-16 text-center bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works?
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Follow 3 simple steps to benchmark your AI models.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="text-xl font-bold text-purple-900">
              1. Upload Model
            </h3>
            <p className="mt-2 text-gray-600">
              Drag & drop your AI model and also describe to start.
            </p>
          </div>
          <div className="p-6 bg-purple-100 rounded-lg">
            <h3 className="text-xl font-bold text-purple-900">
              2. Run Benchmark
            </h3>
            <p className="mt-2 text-gray-600">
              Let our system analyze accuracy of your model.
            </p>
          </div>
          <div className="p-6 bg-purple-200 rounded-lg">
            <h3 className="text-xl font-bold text-purple-900">
              3. View Results
            </h3>
            <p className="mt-2 text-gray-600">
              Get detailed metrics for comparison with other pre-defined models.
            </p>
          </div>
        </div>
      </div>

      <Testimonials />

      {/* CTA Section */}
      <div className="py-20 text-center bg-purple-900 text-white">
        <h2 className="text-3xl font-bold">
          Join the Future of AI Benchmarking
        </h2>
        <p className="mt-2 text-gray-300">
          Start optimizing your AI models today.
        </p>
        <a href="/upload" className="p-[3px] relative mt-6 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
          <div className="px-8 py-3 bg-black rounded-[6px] relative flex items-center space-x-2 text-lg font-semibold transition duration-200 text-white hover:bg-transparent">
            <span>Get Started</span>
            <FaArrowRight />
          </div>
        </a>
      </div>

      <Footer />
    </div>
  );
}