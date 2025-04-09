"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClientComponentClient();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about-us", label: "About Us" },
        { href: "/contact-us", label: "Contact Us" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 text-2xl">
                {isOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Mobile Full-Screen Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center text-lg space-y-6 text-gray-700 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                {navLinks.map(link => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={clsx(
                            "hover:text-gray-900 transition",
                            pathname === link.href && "font-semibold underline underline-offset-4 text-black"
                        )}
                    >
                        {link.label}
                    </a>
                ))}

                <hr className="w-1/2 border-gray-300" />

                {loading ? (
                    <div className="flex flex-col space-y-2 items-center">
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="w-28 h-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                ) : user ? (
                    <a
                        href="/logout"
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Logout
                    </a>
                ) : (
                    <>
                        <a
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "text-gray-700 hover:text-black",
                                pathname === "/login" && "font-semibold underline underline-offset-4 text-black"
                            )}
                        >
                            Log In
                        </a>
                        <a
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition",
                                pathname === "/signup" && "ring-2 ring-purple-400"
                            )}
                        >
                            Sign Up
                        </a>
                    </>
                )}
            </div>
        </>
    );
}
