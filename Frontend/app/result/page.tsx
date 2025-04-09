import AITextAssistant from "../components/Ai_assitant";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Result from "../components/Result";


export default function ReportsPage() {
    return (

        <div>
            <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
                <div>
                    <Navbar />
                </div>

                <div>
                    <Result />
                </div>
            </div>
            <AITextAssistant />
            <div>
                <Footer />
            </div>
        </div>
    );
}
