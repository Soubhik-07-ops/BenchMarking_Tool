"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavMenu() {
    const supabase = createClientComponentClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
        <div className="hidden md:flex items-center space-x-10 lg:space-x-20 xl:space-x-30 text-gray-700">
            {/* Nav Links */}
            {navLinks.map(link => (
                <a
                    key={link.href}
                    href={link.href}
                    className={clsx(
                        "hover:text-gray-900 transition cursor-pointer",
                        pathname === link.href && "font-semibold underline underline-offset-4 text-black"
                    )}
                >
                    {link.label}
                </a>
            ))}

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 min-w-[200px]">
                {loading ? (
                    // Skeleton placeholders to prevent layout shift
                    <>
                        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
                    </>
                ) : user ? (
                    <a
                        href="/logout"
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </a>
                ) : (
                    <>
                        <a
                            href="/login"
                            className={clsx(
                                "text-gray-700 hover:text-black transition",
                                pathname === "/login" && "font-semibold underline underline-offset-4 text-black"
                            )}
                        >
                            Log In
                        </a>
                        <a
                            href="/signup"
                            className={clsx(
                                "bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition",
                                pathname === "/signup" && "ring-2 ring-purple-400"
                            )}
                        >
                            Sign Up
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
