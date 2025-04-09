'use client';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SpotlightCard from "../components/SpotlightCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { loginSchema, LoginType } from "@/validations/authSchema";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (error) {
            toast.error(error, { theme: "colored" });
        }
    }, [error]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (payload: LoginType) => {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });

        setLoading(false);

        if (error) {
            toast.error(error.message, { theme: "colored" });
        } else if (data.user) {
            toast.success("Logged in successfully!", { theme: "colored" });

            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white">
            <Navbar />
            <ToastContainer position="top-right" autoClose={2000} />

            <SpotlightCard className="mt-20 w-[500px] min-h-[500px]" title={""} description={""}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                    <img src="favicon.ico" alt="Logo" className="w-20 h-20 mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-white">Login</h2>

                    <input {...register("email")} type="email" placeholder="Email" className="input-field" />
                    <span className="text-red-400">{errors.email?.message}</span>

                    <input {...register("password")} type="password" placeholder="Password" className="input-field" />
                    <span className="text-red-400">{errors.password?.message}</span>

                    <button type="submit" className="btn-primary font-bold mt-4" disabled={loading}>
                        {loading ? "Processing..." : "Log In"}
                    </button>
                </form>

                <p className="text-md text-white h-20 flex items-center justify-center">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-400 hover:underline cursor-pointer ml-1 font-semibold">
                        Sign Up
                    </a>
                </p>
            </SpotlightCard>
        </div>
    );
}
