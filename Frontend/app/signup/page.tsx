"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpotlightCard from "../components/SpotlightCard";
import Navbar from "../components/Navbar";
import { registerSchema, RegisterType } from "@/validations/authSchema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function Signup() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterType>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (payload: RegisterType) => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
                data: {
                    firstName: payload.firstName,
                    middletName: payload.middleName,
                    lastName: payload.lastName,
                },
            },
        });

        setLoading(false);

        if (error) {
            toast.error(error.message, { theme: "colored" });
        } else if (data.user) {
            toast.success("Account created successfully!", { theme: "colored" });

            // ✅ Wait for 1.5 seconds before redirecting
            setTimeout(() => {
                router.push("/");
                router.refresh(); // Refresh to update the navbar
            }, 1500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white">
            {/* Navbar (Fixed at Top) */}
            <div className="w-full fixed top-5 flex justify-center">
                <Navbar />
            </div>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={2000} />

            <SpotlightCard className="mt-20 w-[500px] min-h-[750px]" title={""} description={""}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                    <img src="favicon.ico" alt="Logo" className="w-20 h-20 mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-white">Sign Up</h2>

                    <input {...register("firstName")} type="text" placeholder="First Name (Required)" className="input-field" required />
                    <span className="text-red-400">{errors.firstName?.message}</span>

                    <input {...register("middleName")} type="text" placeholder="Middle Name (Optional)" className="input-field" />

                    <input {...register("lastName")} type="text" placeholder="Last Name (Required)" className="input-field" required />
                    <span className="text-red-400">{errors.lastName?.message}</span>

                    <input {...register("email")} type="email" placeholder="Email" className="input-field" required />
                    <span className="text-red-400">{errors.email?.message}</span>

                    <input {...register("password")} type="password" placeholder="Create Password" className="input-field" required />
                    <span className="text-red-400">{errors.password?.message}</span>

                    <input {...register("password_confirmation")} type="password" placeholder="Re-enter Password" className="input-field" required />
                    <span className="text-red-400">{errors.password_confirmation?.message}</span>

                    <button type="submit" className="btn-primary font-bold mt-4" disabled={loading}>
                        {loading ? "Processing" : "Sign Up"}
                    </button>
                </form>

                <p className="text-md text-white h-20 flex items-center justify-center">
                    Already have an account?{" "}
                    <span className="text-blue-400 hover:underline cursor-pointer ml-1 font-semibold" onClick={() => router.push("/login")}>
                        Login
                    </span>
                </p>
            </SpotlightCard>
        </div>
    );
}
