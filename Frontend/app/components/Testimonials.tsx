"use client"; // only this needs client-side

export default function Testimonials() {
    return (
        <div className="py-20 px-6 md:px-16 bg-gradient-to-b from-white to-purple-100 text-center relative group">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Our Users Say
            </h2>

            {/* Scrollable container with arrow buttons */}
            <div className="relative">
                {/* Left Scroll Button */}
                <button
                    onClick={() => {
                        document.getElementById("testimonial-slider")?.scrollBy({
                            left: -300,
                            behavior: "smooth",
                        });
                    }}
                    className="hidden group-hover:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg"
                >
                    ←
                </button>

                {/* Right Scroll Button */}
                <button
                    onClick={() => {
                        document.getElementById("testimonial-slider")?.scrollBy({
                            left: 300,
                            behavior: "smooth",
                        });
                    }}
                    className="hidden group-hover:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg"
                >
                    →
                </button>

                {/* Horizontal scrollable reviews */}
                <div
                    id="testimonial-slider"
                    className="mt-6 flex gap-6 md:gap-8 snap-x snap-mandatory overflow-x-auto scrollbar-hide px-2 md:px-6 py-4 scroll-smooth"
                >
                    {[
                        {
                            name: "Alex Johnson",
                            role: "AI Engineer, OpenAI",
                            text: "This platform made AI benchmarking seamless! I saved hours of work.",
                            img: "/images/image1.png",
                        },
                        {
                            name: "Maria Lopez",
                            role: "Data Scientist, Google AI",
                            text: "The most accurate benchmarking tool I've used for AI models.",
                            img: "/images/image2.png",
                        },
                        {
                            name: "Daniel Kim",
                            role: "ML Researcher, Meta",
                            text: "I love the detailed metrics. It helped me fine-tune my model's efficiency!",
                            img: "/images/image3.png",
                        },
                        {
                            name: "Sophia Patel",
                            role: "AI Consultant, IBM",
                            text: "Super intuitive and accurate AI benchmarking. Highly recommend!",
                            img: "/images/image4.png",
                        },
                        {
                            name: "Ethan Walker",
                            role: "Deep Learning Engineer, NVIDIA",
                            text: "Benchmarking that actually makes a difference in model performance.",
                            img: "/images/image5.png",
                        },
                        {
                            name: "Chloe Martin",
                            role: "Data Analyst, Microsoft",
                            text: "Saved my team countless hours in evaluating AI models efficiently!",
                            img: "/images/image6.png",
                        },
                        {
                            name: "James Roberts",
                            role: "AI Product Manager, Tesla",
                            text: "Incredible tool! Helped us optimize our AI model performance easily.",
                            img: "/images/image7.png",
                        },
                        {
                            name: "Emily Carter",
                            role: "Research Scientist, AWS AI",
                            text: "I trust this platform for my AI benchmarking needs. It's fast and reliable!",
                            img: "/images/image8.png",
                        },
                        {
                            name: "William Anderson",
                            role: "AI Dev, Open Source Community",
                            text: "Benchmarking has never been this easy and transparent!",
                            img: "/images/image9.png",
                        },
                        {
                            name: "Olivia Thompson",
                            role: "ML Engineer, Hugging Face",
                            text: "AI Benchmarking made simple, powerful, and effective!",
                            img: "/images/image10.png",
                        },
                        {
                            name: "Noah Wilson",
                            role: "Tech Lead, Intel AI",
                            text: "The best benchmarking tool for AI researchers. So much detail!",
                            img: "/images/image11.png",
                        },
                        {
                            name: "Ava Gonzalez",
                            role: "AI Researcher, Stanford",
                            text: "Easy-to-use and super insightful! Love this platform.",
                            img: "/images/image12.png",
                        },
                    ].map((user, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center min-w-[280px] max-w-[300px] snap-center"
                        >
                            <img
                                src={user.img}
                                alt={user.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <p className="text-gray-600 italic mt-4 text-sm">"{user.text}"</p>
                            <div className="mt-2 flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                            <h4 className="mt-4 font-bold text-gray-900 text-sm">{user.name}</h4>
                            <p className="text-gray-500 text-xs">{user.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

