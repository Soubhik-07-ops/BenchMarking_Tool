import React from "react";
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaInstagram,
    FaPinterest,
    FaYoutube,
    FaTiktok,
    FaDiscord,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Logo & About */}
                    <div>
                        <a href="/" className="inline-block">
                            <img
                                src="favicon.ico"
                                alt="Your Logo"
                                className="w-44 md:w-56"
                            />
                        </a>
                        <p className="mt-4 text-sm text-gray-400">
                            AI.Benchmarking — The most accurate AI benchmarking platform.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4 text-gray-400">
                            <a href="#" className="hover:text-white transition"><FaYoutube size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaTiktok size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaDiscord size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaTwitter size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaLinkedin size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaInstagram size={20} /></a>
                            <a href="#" className="hover:text-white transition"><FaPinterest size={20} /></a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="/about" className="hover:text-purple-400 transition">About</a></li>
                            <li><a href="/trust-security" className="hover:text-purple-400 transition">Trust & Security</a></li>
                            <li><a href="/terms-of-service" className="hover:text-purple-400 transition">Terms of Service</a></li>
                            <li><a href="/privacy-policy" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                            <li><a href="/contact" className="hover:text-purple-400 transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Useful Links</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="/blog" className="hover:text-purple-400 transition">Blog</a></li>
                            <li><a href="/faq" className="hover:text-purple-400 transition">FAQ</a></li>
                            <li><a href="/support" className="hover:text-purple-400 transition">Support</a></li>
                            <li><a href="/ai-tools" className="hover:text-purple-400 transition">AI Tools</a></li>
                            <li><a href="/enterprise-ai" className="hover:text-purple-400 transition">Enterprise AI</a></li>
                        </ul>
                    </div>

                    {/* Free Tools */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Free Tools</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="/paraphrasing-tool" className="hover:text-purple-400 transition">Paraphrasing Tool</a></li>
                            <li><a href="/text-summarizer" className="hover:text-purple-400 transition">Text Summarizer</a></li>
                            <li><a href="/article-rewriter" className="hover:text-purple-400 transition">Article Rewriter</a></li>
                            <li><a href="/ai-blog-writer" className="hover:text-purple-400 transition">AI Blog Writer</a></li>
                            <li><a href="/pdf-translator" className="hover:text-purple-400 transition">PDF Translator</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} AI.Benchmarking. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
