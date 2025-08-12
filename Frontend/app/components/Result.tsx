"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlurText from "./BlurText";
import { motion, AnimatePresence } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    BarChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

export default function ResultPage() {
    const [metrics1, setMetrics1] = useState<Record<string, any> | null>(null);
    const [metrics2, setMetrics2] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Model1" | "Model2">("Model1");
    const [chartType, setChartType] = useState<"line" | "bar">("line");

    useEffect(() => {
        try {
            // Get the results from session storage
            const resultsData = sessionStorage.getItem('benchmarkResults');
            if (resultsData) {
                const data = JSON.parse(resultsData);
                setMetrics1(data["Model 1"] || null);
                setMetrics2(data["Model 2"] || null);
            } else {
                throw new Error("No benchmark data found in session.");
            }
        } catch (error) {
            console.error("Failed to load results from session storage:", error);
            toast.error("Failed to load results!");
        } finally {
            setLoading(false);
        }
    }, []);

    const motionVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const handleSwipe = (_: any, info: { offset: { x: number } }) => {
        if (info.offset.x < -100 && activeTab === "Model1") {
            setActiveTab("Model2");
        } else if (info.offset.x > 100 && activeTab === "Model2") {
            setActiveTab("Model1");
        }
    };

    const formatMetricsForChart = (m1: Record<string, any>, m2: Record<string, any>) => {
        if (!m1 || !m2) return [];
        // Filter out non-numeric or null values before charting
        const keys = Object.keys(m1).filter(key => typeof m1[key] === 'number');
        return keys.map((key) => ({
            metric: key.replace(/_/g, " ").toUpperCase(),
            Model1: m1[key],
            Model2: m2[key],
        }));
    };

    const chartData = metrics1 && metrics2 ? formatMetricsForChart(metrics1, metrics2) : [];

    return (
        <div className="flex flex-col items-center min-h-screen text-white p-10 md:p-20 bg-gradient-to-br from-purple-900 to-indigo-900">
            <ToastContainer />
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-5xl text-gray-200 text-center mb-12 mt-15">
                <BlurText
                    text="Model Benchmarking Results"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-5xl md:text-6xl font-bold"
                />
            </h1>

            {loading ? (
                <p className="mt-20 text-gray-400 text-xl">Loading results...</p>
            ) : (!metrics1 || !metrics2) ? (
                <p className="mt-20 text-gray-400 text-xl">No results found. Please run a new benchmark.</p>
            ) : (
                <div className="w-full max-w-6xl space-y-12">
                    {chartData.length > 0 && (
                        <>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setChartType("line")}
                                    className={`px-6 py-3 text-lg font-semibold rounded-md transition ${chartType === "line"
                                        ? "bg-fuchsia-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        }`}
                                >
                                    Line Chart
                                </button>
                                <button
                                    onClick={() => setChartType("bar")}
                                    className={`px-6 py-3 text-lg font-semibold rounded-md transition ${chartType === "bar"
                                        ? "bg-fuchsia-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        }`}
                                >
                                    Bar Chart
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gray-950 p-6 rounded-xl shadow-lg w-full"
                            >
                                <h3 className="text-2xl font-bold text-gray-100 mb-4 text-center">
                                    Model Comparison {chartType === "line" ? "Line" : "Bar"} Chart
                                </h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    {chartType === "line" ? (
                                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="metric" tick={{ fill: '#ccc', fontSize: 12 }} />
                                            <YAxis tick={{ fill: '#ccc', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "10px", border: "none" }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="Model1" stroke="#8b5cf6" strokeWidth={3} />
                                            <Line type="monotone" dataKey="Model2" stroke="#ec4899" strokeWidth={3} />
                                        </LineChart>
                                    ) : (
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="metric" tick={{ fill: '#ccc', fontSize: 12 }} />
                                            <YAxis tick={{ fill: '#ccc', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "10px", border: "none" }} />
                                            <Legend />
                                            <Bar dataKey="Model1" fill="#8b5cf6" animationDuration={800} />
                                            <Bar dataKey="Model2" fill="#ec4899" animationDuration={800} />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </motion.div>
                        </>
                    )}

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setActiveTab("Model1")}
                            className={`px-6 py-3 text-lg font-semibold rounded-md transition ${activeTab === "Model1"
                                ? "bg-fuchsia-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                        >
                            Model 1
                        </button>
                        <button
                            onClick={() => setActiveTab("Model2")}
                            className={`px-6 py-3 text-lg font-semibold rounded-md transition ${activeTab === "Model2"
                                ? "bg-fuchsia-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                        >
                            Model 2
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "Model1" && metrics1 && (
                            <motion.div
                                key="model1"
                                drag="x"
                                onDragEnd={handleSwipe}
                                dragConstraints={{ left: 0, right: 0 }}
                                variants={motionVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="bg-gray-900 rounded-xl p-6 w-full shadow-lg cursor-grab active:cursor-grabbing"
                            >
                                <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Model 1</h2>
                                <ul className="text-gray-300 text-lg space-y-3">
                                    {Object.entries(metrics1).map(([key, value]) => (
                                        <li key={key}>
                                            <strong className="text-white">
                                                {key.replace(/_/g, " ").toUpperCase()}:
                                            </strong>{" "}
                                            {value === null ? 'N/A' : value}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {activeTab === "Model2" && metrics2 && (
                            <motion.div
                                key="model2"
                                drag="x"
                                onDragEnd={handleSwipe}
                                dragConstraints={{ left: 0, right: 0 }}
                                variants={motionVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="bg-gray-900 rounded-xl p-6 w-full shadow-lg cursor-grab active:cursor-grabbing"
                            >
                                <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Model 2</h2>
                                <ul className="text-gray-300 text-lg space-y-3">
                                    {Object.entries(metrics2).map(([key, value]) => (
                                        <li key={key}>
                                            <strong className="text-white">
                                                {key.replace(/_/g, " ").toUpperCase()}:
                                            </strong>{" "}
                                            {value === null ? 'N/A' : value}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}