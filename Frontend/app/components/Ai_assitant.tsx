"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaPaperPlane, FaTimes, FaRobot } from "react-icons/fa";

const AITextAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; text: string; image?: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const botImage = "https://cdn-icons-png.flaticon.com/512/4712/4712105.png";
    const userImage = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    useEffect(() => {
        if (isOpen) {
            setMessages([
                { role: "bot", text: "Welcome To AI.BENCHMARK! How can I help you?", image: botImage },
            ]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage = { role: "user", text: input, image: userImage };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an AI assistant specializing in benchmarking. Be concise and helpful.\n\nUser's Question: ${input}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            let botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't understand that.";

            // Truncate long responses
            botReply = botReply.split(" ").slice(0, 50).join(" ") + (botReply.split(" ").length > 50 ? "..." : "");

            setMessages(prev => [...prev, { role: "bot", text: botReply, image: botImage }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: "bot",
                text: "Oops! Something went wrong. Please try again later.",
                image: botImage
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            setImages(prev => [...prev, ...newImages]);

            newImages.forEach(image => {
                setMessages(prev => [...prev, {
                    role: "user",
                    text: `Uploaded an image: ${image.name}`,
                    image: userImage
                }]);
            });
        }
    };

    const handleAttachButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <button
                onClick={handleToggle}
                className="bg-black text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,165,0,0.8)] hover:bg-orange-600 hover:scale-110 focus:outline-none flex items-center justify-center"
                aria-label="Toggle AI Assistant"
            >
                <FaRobot size={24} />
            </button>

            {isOpen && (
                <div className="w-96 h-[500px] bg-white text-black rounded-lg shadow-lg flex flex-col mt-4">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-black text-white p-3 rounded-t-lg">
                        <span className="text-lg font-bold">AI Assistant</span>
                        <button
                            onClick={handleToggle}
                            className="focus:outline-none"
                            aria-label="Close chat"
                        >
                            <FaTimes className="cursor-pointer text-white" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start space-x-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role !== "user" && (
                                    <img
                                        src={msg.image || botImage}
                                        alt="AI Assistant avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <div
                                    className={`p-2 rounded-lg max-w-[70%] ${msg.role === "user"
                                        ? "bg-orange-300 text-black"
                                        : "bg-black text-white"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.role === "user" && (
                                    <img
                                        src={msg.image || userImage}
                                        alt="User avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                            </div>
                        ))}

                        {images.map((image, index) => (
                            <div key={index} className="flex justify-end">
                                <div className="bg-green-300 text-black p-2 rounded-lg max-w-[70%]">
                                    <span>Uploaded Image: {image.name}</span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center space-x-2">
                                <img src={botImage} alt="AI Assistant avatar" className="w-8 h-8 rounded-full" />
                                <div className="bg-black text-white p-2 rounded-lg">Typing...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer */}
                    <div className="p-3 flex items-center space-x-2 bg-gray-200 rounded-b-lg">
                        <button
                            onClick={handleAttachButtonClick}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                            aria-label="Attach file"
                        >
                            <FaPaperclip />
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-lg bg-black text-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            aria-label="Type your message"
                        />
                        <button
                            onClick={handleSend}
                            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none"
                            disabled={!input.trim()}
                            aria-label="Send message"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITextAssistant;