import MobileNav from "./MobileNav";
import NavMenu from "./NavMenu";

export default function Navbar() {
    return (
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-screen-xl bg-white shadow-lg rounded-2xl px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between z-50">
            {/* Brand Name */}
            <div className="text-xl font-bold text-gray-800">
                AI.<span className="text-purple-600">Benchmark</span>
            </div>

            {/* Desktop Navigation */}
            <NavMenu />

            {/* Mobile Navigation */}
            <MobileNav />
        </nav>
    );
}