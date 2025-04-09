"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SpotlightCard from "../components/SpotlightCard";

export default function Logout() {
    const [loading, setLoading] = useState<boolean>(false);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();

        setLoading(false);
        if (error) {
            toast.error(error.message, { theme: "colored" });
        } else {
            toast.success("Logged out successfully", { theme: "colored" });
            setTimeout(() => {
                router.push("/"); // Redirect to home after logout
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white">
            {/* Navbar */}
            <Navbar />

            {/* Logout Confirmation Card */}
            <SpotlightCard className="mt-20 w-[400px] min-h-[300px] flex flex-col items-center justify-center" title={""} description={""}>
                <ToastContainer />
                <img src="favicon.ico" alt="Logo" className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-white">Are you absolutely sure to log out?</h2>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Logging out..." : "Yes, Log Out"}
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </SpotlightCard>
        </div>
    );
}
