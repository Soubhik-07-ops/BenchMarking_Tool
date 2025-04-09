"use client";
import React, { useRef, useState } from "react";

interface Position {
    x: number;
    y: number;
}

const ModelForm: React.FC = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState<number>(0);

    const [formData, setFormData] = useState({
        modelName: "",
        description: "",
        useCases: "",
        modelType: ""
    });

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(0.6)}
            onMouseLeave={() => setOpacity(0)}
            className="relative rounded-3xl border border-neutral-800 bg-[#1f2937f2] overflow-hidden p-8 w-96 mx-auto"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.25), transparent 80%)`
                }}
            />
            <h2 className="text-center text-white text-xl font-semibold mb-4">Model Submission</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="modelName"
                    placeholder="Model Name"
                    value={formData.modelName}
                    onChange={handleChange}
                    className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none h-20"
                />
                <input
                    type="text"
                    name="useCases"
                    placeholder="Use Cases"
                    value={formData.useCases}
                    onChange={handleChange}
                    className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
                />
                <input
                    type="text"
                    name="modelType"
                    placeholder="Model Type"
                    value={formData.modelType}
                    onChange={handleChange}
                    className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                >
                    Submit Model
                </button>
            </form>
        </div>
    );
};

export default ModelForm;
